import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import fs from "fs/promises";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
      // Accept only image files (no GIF as requested)
      const allowedTypes = /jpeg|jpg|png|webp|bmp|tiff/;
      const mimeType = allowedTypes.test(file.mimetype);
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      
      if (mimeType && extname) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed (no GIF)'));
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit
    }
  });
  // Profile routes
  app.get("/api/profile", async (req, res) => {
    try {
      // For now, use a dummy user ID. In a real app, get from session/auth
      const userId = "demo-user";
      const profile = await storage.getUserProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/profile", async (req, res) => {
    try {
      // For now, use a dummy user ID. In a real app, get from session/auth
      const userId = "demo-user";
      
      // Check if profile already exists and update, or create new
      const existingProfile = await storage.getUserProfile(userId);
      let profile;
      
      if (existingProfile) {
        profile = await storage.updateUserProfile(userId, req.body);
      } else {
        profile = await storage.createUserProfile({ ...req.body, userId });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error saving profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Gemini AI endpoint for ingredient extraction
  app.post("/api/ocr-extract", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      console.log('Processing ingredient extraction for file:', req.file.originalname);
      
      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      
      // Read the image file
      const imageData = await fs.readFile(req.file.path);
      const imageBase64 = imageData.toString('base64');
      
      // Clean up the uploaded file
      await fs.unlink(req.file.path);
      
      const prompt = `Analyze this cosmetic/skincare product ingredient label image and extract all ingredients with their amounts if listed. Return the response as a JSON object with this exact structure:
      {
        "ingredients": [
          {
            "name": "ingredient name",
            "amount": "amount if specified or null"
          }
        ]
      }
      
      Guidelines:
      - Extract ingredient names exactly as they appear
      - Include amounts/percentages if visible (e.g., "2%", "0.5%", etc.)
      - If no amount is specified, set amount to null
      - Only include actual ingredients, not instructions or other text
      - Clean up any OCR artifacts but keep ingredient names accurate`;
      
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBase64,
            mimeType: req.file.mimetype
          }
        }
      ]);
      
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response from Gemini
      let extractedData;
      try {
        // Remove any markdown formatting if present
        const cleanedText = text.replace(/```json\n?|```\n?/g, '').trim();
        extractedData = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error("Error parsing Gemini response:", parseError);
        console.log("Raw response:", text);
        throw new Error("Failed to parse ingredient data from AI response");
      }
      
      res.json({
        ingredients: extractedData.ingredients || []
      });
      
    } catch (error) {
      console.error("Error processing ingredient extraction:", error);
      
      // Clean up file if it exists
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error("Error cleaning up file:", unlinkError);
        }
      }
      
      res.status(500).json({ 
        error: "Failed to process image", 
        details: error.message 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}


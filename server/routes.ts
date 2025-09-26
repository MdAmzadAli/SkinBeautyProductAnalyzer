import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import Tesseract from "tesseract.js";
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

  // OCR endpoint for ingredient extraction
  app.post("/api/ocr-extract", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      console.log('Processing OCR for file:', req.file.originalname);
      
      // Perform OCR using Tesseract
      const result = await Tesseract.recognize(
        req.file.path,
        'eng',
        {
          logger: m => console.log(m)
        }
      );
      
      // Clean up the uploaded file
      await fs.unlink(req.file.path);
      
      // Extract and clean the text to get only ingredient names
      const extractedText = result.data.text;
      const cleanedIngredients = cleanIngredientText(extractedText);
      
      res.json({
        originalText: extractedText,
        ingredients: cleanedIngredients
      });
      
    } catch (error) {
      console.error("Error processing OCR:", error);
      
      // Clean up file if it exists
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error("Error cleaning up file:", unlinkError);
        }
      }
      
      res.status(500).json({ error: "Failed to process image" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

// Helper function to clean and extract ingredient names from OCR text
function cleanIngredientText(text: string): string[] {
  // Remove common OCR artifacts and clean the text
  let cleanedText = text
    .replace(/[^a-zA-Z0-9\s,\-\(\)\[\]]/g, '') // Remove special characters except basic punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  // Split by common delimiters used in ingredient lists
  const ingredients = cleanedText
    .split(/[,;\n]/) // Split by comma, semicolon, or newline
    .map(ingredient => ingredient.trim())
    .filter(ingredient => {
      // Filter out empty strings and common non-ingredient words
      if (!ingredient) return false;
      if (ingredient.length < 2) return false;
      
      // Filter out common OCR artifacts and non-ingredient terms
      const excludePatterns = [
        /^\d+$/,  // Pure numbers
        /ingredients/i,
        /contains/i,
        /directions/i,
        /use/i,
        /apply/i,
        /product/i,
        /warning/i,
        /caution/i
      ];
      
      return !excludePatterns.some(pattern => pattern.test(ingredient));
    })
    .slice(0, 20); // Limit to reasonable number of ingredients
  
  return ingredients;
}
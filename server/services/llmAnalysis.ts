
import { GoogleGenerativeAI } from "@google/generative-ai";

interface UserSkinProfile {
  skinType: string;
  concerns: string[];
  allergies: string[];
  lifestyle: string[];
  additionalInfo?: string;
}

interface ProcessedIngredient {
  ingredient: string;
  snippets: Array<{
    text: string;
    source: string;
    link: string;
    weight: number;
  }>;
  totalScore: number;
}

interface AnalysisResult {
  name: string;
  safety: 'excellent' | 'good' | 'notbad' | 'bad';
  explanation: string;
  sources: string[];
}

export class LLMAnalysisService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  }

  async analyzeIngredients(
    prioritizedIngredients: ProcessedIngredient[],
    allIngredients: string[],
    userProfile: UserSkinProfile
  ): Promise<AnalysisResult[]> {
    try {
      const analysisPrompt = this.buildAnalysisPrompt(prioritizedIngredients, allIngredients, userProfile);
      
      const result = await this.model.generateContent(analysisPrompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      let analysisData;
      try {
        const cleanedText = text.replace(/```json\n?|```\n?/g, '').trim();
        analysisData = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error("Error parsing LLM response:", parseError);
        throw new Error("Failed to parse analysis data from AI response");
      }
      
      return analysisData.ingredients || [];
    } catch (error) {
      console.error("Error in LLM analysis:", error);
      throw error;
    }
  }

  private buildAnalysisPrompt(
    prioritizedIngredients: ProcessedIngredient[],
    allIngredients: string[],
    userProfile: UserSkinProfile
  ): string {
    const skinProfileText = `
User Skin Profile:
- Skin Type: ${userProfile.skinType}
- Primary Concerns: ${userProfile.concerns.join(', ')}
- Known Allergies/Sensitivities: ${userProfile.allergies.join(', ')}
- Lifestyle Factors: ${userProfile.lifestyle.join(', ')}
${userProfile.additionalInfo ? `- Additional Info: ${userProfile.additionalInfo}` : ''}
`;

    const researchContext = prioritizedIngredients.map(ing => {
      const topSnippets = ing.snippets
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 3)
        .map(snippet => `"${snippet.text}" (Source: ${snippet.source} - ${snippet.link})`)
        .join('\n');
      
      return `Ingredient: ${ing.ingredient}
Research Context:
${topSnippets}
`;
    }).join('\n\n');

    const remainingIngredients = allIngredients.filter(ing => 
      !prioritizedIngredients.some(pi => pi.ingredient.toLowerCase() === ing.toLowerCase())
    );

    return `You are a dermatological AI assistant specializing in skincare ingredient analysis. Analyze the following ingredients for a user with the given skin profile.

${skinProfileText}

PRIORITY INGREDIENTS (with research context):
${researchContext}

${remainingIngredients.length > 0 ? `
OTHER INGREDIENTS (analyze based on general knowledge):
${remainingIngredients.join(', ')}
` : ''}

For each ingredient, provide analysis in this exact JSON format:
{
  "ingredients": [
    {
      "name": "ingredient name",
      "safety": "excellent|good|notbad|bad",
      "explanation": "Detailed explanation with inline source citations. Each factual statement should end with (Source: website_link). Focus on compatibility with user's skin type, concerns, and allergies.",
      "sources": ["list", "of", "unique", "source", "links"]
    }
  ]
}

SAFETY RATING GUIDELINES:
- "excellent": Perfect for user's skin type and concerns, highly beneficial
- "good": Generally beneficial with minor considerations
- "notbad": Neutral or mixed effects, use with caution
- "bad": Avoid due to incompatibility with skin type/concerns or known irritants

ANALYSIS REQUIREMENTS:
1. Reference the user's specific skin type, concerns, and allergies
2. Include inline citations after each factual statement: (Source: website_link)
3. Use research context provided for priority ingredients
4. For ingredients without research context, use established dermatological knowledge
5. Be specific about why each ingredient is rated as such for THIS user
6. Keep explanations comprehensive but concise

Provide analysis for ALL ingredients listed above.`;
  }
}

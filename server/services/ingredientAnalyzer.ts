
import { GoogleSearchService } from './googleSearch.js';
import { LLMAnalysisService } from './llmAnalysis.js';

interface UserSkinProfile {
  skinType: string;
  concerns: string[];
  allergies: string[];
  lifestyle: string[];
  additionalInfo?: string;
}

interface AnalysisResult {
  name: string;
  safety: 'excellent' | 'good' | 'notbad' | 'bad';
  explanation: string;
  sources: string[];
}

export class IngredientAnalyzerService {
  private searchService: GoogleSearchService;
  private llmService: LLMAnalysisService;

  constructor() {
    this.searchService = new GoogleSearchService();
    this.llmService = new LLMAnalysisService();
  }

  async analyzeIngredients(
    ingredients: string[],
    userProfile: UserSkinProfile
  ): Promise<AnalysisResult[]> {
    try {
      console.log('Starting comprehensive ingredient analysis for:', ingredients);
      
      // Step 1: Search for ingredient information
      console.log('Step 1: Searching for ingredient research data...');
      const searchResults = await this.searchService.searchIngredients(ingredients);
      
      // Step 2: Select top priority ingredients based on search results
      console.log('Step 2: Prioritizing ingredients based on research data...');
      const prioritizedIngredients = this.searchService.selectTopIngredients(searchResults, 5);
      
      console.log('Priority ingredients:', prioritizedIngredients.map(p => `${p.ingredient} (score: ${p.totalScore})`));
      
      // Step 3: Generate LLM analysis with prioritized context
      console.log('Step 3: Generating AI analysis with research context...');
      const analysisResults = await this.llmService.analyzeIngredients(
        prioritizedIngredients,
        ingredients,
        userProfile
      );
      
      console.log('Analysis completed for', analysisResults.length, 'ingredients');
      return analysisResults;
      
    } catch (error) {
      console.error('Error in ingredient analysis pipeline:', error);
      throw error;
    }
  }
}

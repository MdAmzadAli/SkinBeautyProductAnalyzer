
interface SearchResult {
  title: string;
  snippet: string;
  link: string;
  displayLink: string;
}

interface SearchResponse {
  items?: SearchResult[];
}

interface ProcessedResult {
  ingredient: string;
  snippets: Array<{
    text: string;
    source: string;
    link: string;
    weight: number;
  }>;
  totalScore: number;
}

export class GoogleSearchService {
  private apiKey: string;
  private searchEngineId: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_SEARCH_API_KEY || "";
    this.searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID || "";
  }

  async searchIngredients(ingredients: string[]): Promise<ProcessedResult[]> {
    if (!this.apiKey || !this.searchEngineId) {
      throw new Error("Google Search API credentials not configured");
    }

    // Create comprehensive search query
    const searchQuery = ingredients.map(ing => `"${ing.trim()}" skincare`).join(" OR ");
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${this.apiKey}&cx=${this.searchEngineId}&q=${encodeURIComponent(searchQuery)}&num=10`
      );

      if (!response.ok) {
        throw new Error(`Search API failed: ${response.status}`);
      }

      const data: SearchResponse = await response.json();
      
      return this.processSearchResults(data.items || [], ingredients);
    } catch (error) {
      console.error("Error searching ingredients:", error);
      throw error;
    }
  }

  private processSearchResults(results: SearchResult[], ingredients: string[]): ProcessedResult[] {
    const ingredientData: Map<string, ProcessedResult> = new Map();

    // Initialize ingredient data
    ingredients.forEach(ingredient => {
      ingredientData.set(ingredient.toLowerCase(), {
        ingredient,
        snippets: [],
        totalScore: 0
      });
    });

    // Process each search result
    results.forEach(result => {
      const snippet = result.snippet;
      const title = result.title;
      const combinedText = `${title} ${snippet}`.toLowerCase();

      // Check each ingredient against this result
      ingredients.forEach(ingredient => {
        const ingredientLower = ingredient.toLowerCase();
        const data = ingredientData.get(ingredientLower);
        
        if (data && combinedText.includes(ingredientLower)) {
          const weight = this.calculateWeight(combinedText, ingredientLower, result);
          
          data.snippets.push({
            text: snippet,
            source: result.displayLink,
            link: result.link,
            weight
          });
          
          data.totalScore += weight;
        }
      });
    });

    // Sort by total score and return top results
    return Array.from(ingredientData.values())
      .filter(data => data.snippets.length > 0)
      .sort((a, b) => b.totalScore - a.totalScore);
  }

  private calculateWeight(text: string, ingredient: string, result: SearchResult): number {
    let weight = 1;
    
    // Higher weight for title mentions
    if (result.title.toLowerCase().includes(ingredient)) {
      weight += 2;
    }
    
    // Higher weight for trusted domains
    const trustedDomains = ['pubmed', 'ncbi', 'dermatology', 'medscape', 'webmd', 'healthline'];
    if (trustedDomains.some(domain => result.displayLink.includes(domain))) {
      weight += 3;
    }
    
    // Higher weight for skin condition keywords
    const skinKeywords = ['acne', 'sensitive', 'dry', 'oily', 'aging', 'pigmentation', 'eczema'];
    const keywordMatches = skinKeywords.filter(keyword => text.includes(keyword)).length;
    weight += keywordMatches * 0.5;
    
    // Higher weight for safety/benefit keywords
    const safetyKeywords = ['safe', 'beneficial', 'avoid', 'irritating', 'comedogenic', 'non-comedogenic'];
    const safetyMatches = safetyKeywords.filter(keyword => text.includes(keyword)).length;
    weight += safetyMatches * 1.5;
    
    return weight;
  }

  selectTopIngredients(processedResults: ProcessedResult[], maxCount: number = 5): ProcessedResult[] {
    return processedResults.slice(0, maxCount);
  }
}

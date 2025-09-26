import IngredientAnalysis from '../IngredientAnalysis';

//todo: remove mock functionality - replace with real data from backend
const mockIngredients = [
  {
    name: "Hyaluronic Acid",
    safety: 'excellent' as const,
    explanation: "Excellent hydrating ingredient that's suitable for all skin types. Hyaluronic acid can hold up to 1000 times its weight in water, making it perfect for your dry skin concerns.",
    sources: [
      "https://pubmed.ncbi.nlm.nih.gov/skincare-research",
      "https://dermatologyjournal.org/hyaluronic-acid-safety"
    ]
  },
  {
    name: "Niacinamide",
    safety: 'excellent' as const,
    explanation: "A form of Vitamin B3 that's excellent for reducing inflammation and regulating oil production. Perfect for your combination skin type and acne concerns.",
    sources: [
      "https://ijdvl.com/niacinamide-benefits",
      "https://skincarescience.org/niacinamide-research"
    ]
  },
  {
    name: "Glycolic Acid",
    safety: 'good' as const,
    explanation: "An alpha hydroxy acid that can help with aging and pigmentation concerns. Good for your skin type but start slowly to build tolerance.",
    sources: [
      "https://dermsafety.org/glycolic-acid-guidelines"
    ]
  },
  {
    name: "Alcohol Denat",
    safety: 'notbad' as const,
    explanation: "Can be drying and irritating, especially for sensitive skin. Since you have combination skin, this may worsen dry areas while helping oily zones.",
    sources: [
      "https://skinbarrier.org/alcohol-in-skincare"
    ]
  },
  {
    name: "Artificial Fragrance",
    safety: 'bad' as const,
    explanation: "You indicated sensitivity to fragrances in your profile. This ingredient could cause irritation, redness, or allergic reactions for your skin type.",
    sources: [
      "https://contactdermatitis.org/fragrance-allergy-study"
    ]
  }
];

export default function IngredientAnalysisExample() {
  const extractedText = "Water, Hyaluronic Acid, Niacinamide, Glycolic Acid, Glycerin, Alcohol Denat, Artificial Fragrance, Preservatives";

  const handleConfirmText = (text: string) => {
    console.log('Confirmed text:', text);
    alert('Text confirmed! This would trigger re-analysis.');
  };

  const handleSaveAnalysis = () => {
    console.log('Saving analysis...');
    alert('Analysis saved to history!');
  };

  return (
    <div className="p-6 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Ingredient Analysis Results</h1>
          <p className="text-muted-foreground">
            AI-powered compatibility analysis based on your skin profile
          </p>
        </div>
        <IngredientAnalysis
          extractedText={extractedText}
          ingredients={mockIngredients}
          onConfirmText={handleConfirmText}
          onSaveAnalysis={handleSaveAnalysis}
          isLoading={false}
        />
      </div>
    </div>
  );
}
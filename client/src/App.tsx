import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Components
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
import MultiStepForm from "./components/MultiStepForm";
import CameraUpload from "./components/CameraUpload";
import IngredientAnalysis from "./components/IngredientAnalysis";
import AnalysisHistory from "./components/AnalysisHistory";

//todo: remove mock functionality - replace with real data from backend
const mockAnalysisRecords = [
  {
    id: "1",
    productName: "Vitamin C Serum",
    imageUrl: "/api/placeholder/300/200",
    analyzedAt: "2024-01-15T10:30:00Z",
    summary: { excellent: 8, good: 3, notbad: 1, bad: 0 },
    topConcerns: ["Fragrance sensitivity"]
  },
  {
    id: "2",
    productName: "Daily Moisturizer", 
    imageUrl: "/api/placeholder/300/200",
    analyzedAt: "2024-01-12T14:20:00Z",
    summary: { excellent: 5, good: 4, notbad: 2, bad: 1 },
    topConcerns: ["Alcohol content", "Comedogenic oils"]
  }
];

const mockIngredients = [
  {
    name: "Hyaluronic Acid",
    safety: 'excellent' as const,
    explanation: "Excellent hydrating ingredient suitable for all skin types. Helps retain moisture and plump the skin.",
    sources: ["https://pubmed.ncbi.nlm.nih.gov/skincare-research"]
  },
  {
    name: "Niacinamide", 
    safety: 'excellent' as const,
    explanation: "Vitamin B3 that reduces inflammation and regulates oil production. Perfect for combination skin.",
    sources: ["https://ijdvl.com/niacinamide-benefits"]
  },
  {
    name: "Alcohol Denat",
    safety: 'notbad' as const, 
    explanation: "Can be drying and irritating. May worsen dry areas while helping oily zones.",
    sources: ["https://skinbarrier.org/alcohol-in-skincare"]
  }
];

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [extractedText, setExtractedText] = useState("");
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleProfileComplete = (data: any) => {
    console.log('Profile completed:', data);
    setUserProfile(data);
    setCurrentView('camera');
  };

  const handleImageCapture = (file: File) => {
    console.log('Image captured:', file.name);
    // Simulate OCR extraction
    setExtractedText("Water, Hyaluronic Acid, Niacinamide, Glycolic Acid, Alcohol Denat, Preservatives");
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate analysis delay
    setTimeout(() => {
      setAnalysisResults(mockIngredients);
      setIsAnalyzing(false);
      setCurrentView('analysis');
    }, 2000);
  };

  const handleConfirmText = (text: string) => {
    console.log('Text confirmed:', text);
    setExtractedText(text);
    handleAnalyze();
  };

  const handleSaveAnalysis = () => {
    console.log('Saving analysis...');
    alert('Analysis saved to history!');
    setCurrentView('history');
  };

  const handleViewRecord = (id: string) => {
    console.log('Viewing record:', id);
    setCurrentView('analysis');
  };

  const handleDeleteRecord = (id: string) => {
    console.log('Deleting record:', id);
    alert(`Record ${id} would be deleted`);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomePage 
            onNavigate={handleNavigate}
            userStats={{
              analyzedProducts: 12,
              safeProducts: 8,
              profileComplete: !!userProfile
            }}
          />
        );
      
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Create Your Skin Profile</h1>
              <p className="text-muted-foreground">
                Help us understand your skin better for personalized ingredient analysis
              </p>
            </div>
            <MultiStepForm onComplete={handleProfileComplete} />
          </div>
        );
      
      case 'camera':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Ingredient Analysis</h1>
              <p className="text-muted-foreground">
                Upload a clear photo of the ingredient list for AI-powered analysis
              </p>
            </div>
            <CameraUpload 
              onImageCapture={handleImageCapture}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </div>
        );
      
      case 'analysis':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Analysis Results</h1>
              <p className="text-muted-foreground">
                AI-powered compatibility analysis based on your skin profile
              </p>
            </div>
            <IngredientAnalysis
              extractedText={extractedText}
              ingredients={analysisResults}
              onConfirmText={handleConfirmText}
              onSaveAnalysis={handleSaveAnalysis}
              isLoading={isAnalyzing}
            />
          </div>
        );
      
      case 'history':
        return (
          <AnalysisHistory
            records={mockAnalysisRecords}
            onViewRecord={handleViewRecord}
            onDeleteRecord={handleDeleteRecord}
          />
        );
      
      default:
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
            <p className="text-muted-foreground">The requested page could not be found.</p>
          </div>
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navigation currentView={currentView} onNavigate={handleNavigate} />
          
          <main className="p-6 pb-24 md:pb-6">
            <div className="max-w-6xl mx-auto">
              {renderCurrentView()}
            </div>
          </main>
        </div>
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

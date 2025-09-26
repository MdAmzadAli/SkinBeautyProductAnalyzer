import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Edit3, 
  Save,
  ExternalLink,
  Heart
} from "lucide-react";

interface Ingredient {
  name: string;
  safety: 'excellent' | 'good' | 'notbad' | 'bad';
  explanation: string;
  sources: string[];
}

interface IngredientAnalysisProps {
  extractedText: string;
  ingredients: Ingredient[];
  onConfirmText: (text: string) => void;
  onSaveAnalysis: () => void;
  isLoading?: boolean;
}

const SAFETY_CONFIG = {
  excellent: {
    icon: CheckCircle,
    color: "text-safety-excellent",
    bgColor: "bg-safety-excellent/10",
    borderColor: "border-safety-excellent/20",
    label: "Excellent"
  },
  good: {
    icon: CheckCircle,
    color: "text-safety-good", 
    bgColor: "bg-safety-good/10",
    borderColor: "border-safety-good/20",
    label: "Good"
  },
  notbad: {
    icon: AlertTriangle,
    color: "text-safety-notbad",
    bgColor: "bg-safety-notbad/10", 
    borderColor: "border-safety-notbad/20",
    label: "Not Bad"
  },
  bad: {
    icon: XCircle,
    color: "text-safety-bad",
    bgColor: "bg-safety-bad/10",
    borderColor: "border-safety-bad/20", 
    label: "Bad"
  }
};

export default function IngredientAnalysis({ 
  extractedText, 
  ingredients, 
  onConfirmText, 
  onSaveAnalysis,
  isLoading = false 
}: IngredientAnalysisProps) {
  const [isEditingText, setIsEditingText] = useState(false);
  const [editedText, setEditedText] = useState(extractedText);

  const handleConfirmText = () => {
    onConfirmText(editedText);
    setIsEditingText(false);
  };

  const safetyStats = ingredients.reduce((acc, ingredient) => {
    acc[ingredient.safety] = (acc[ingredient.safety] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-4 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <h3 className="text-lg font-medium mb-2">Analyzing Ingredients</h3>
            <p className="text-muted-foreground">
              Our AI is analyzing each ingredient for your skin profile...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Extracted Text Review */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Extracted Ingredients
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditingText(!isEditingText)}
              data-testid="button-edit-text"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {isEditingText ? 'Cancel' : 'Edit'}
            </Button>
          </div>
          <p className="text-muted-foreground">
            Review and confirm the extracted ingredient list before analysis
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditingText ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-ingredients">Ingredient List</Label>
                <Textarea
                  id="edit-ingredients"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="mt-2 min-h-[100px]"
                  placeholder="Enter ingredients separated by commas..."
                  data-testid="textarea-edit-ingredients"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleConfirmText} data-testid="button-confirm-text">
                  <Save className="w-4 h-4 mr-2" />
                  Confirm & Analyze
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditingText(false)}
                  data-testid="button-cancel-edit"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="whitespace-pre-wrap text-sm" data-testid="text-extracted-ingredients">
                {extractedText}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {ingredients.length > 0 && (
        <>
          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(SAFETY_CONFIG).map(([safety, config]) => (
                  <div key={safety} className="text-center p-4 rounded-lg bg-card border">
                    <config.icon className={`w-6 h-6 mx-auto mb-2 ${config.color}`} />
                    <div className="text-2xl font-bold" data-testid={`stat-${safety}`}>
                      {safetyStats[safety] || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">{config.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ingredient Details */}
          <div className="space-y-4">
            {ingredients.map((ingredient, index) => {
              const config = SAFETY_CONFIG[ingredient.safety];
              const Icon = config.icon;
              
              return (
                <Card key={index} className={`border-l-4 ${config.borderColor}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${config.bgColor}`}>
                          <Icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg" data-testid={`ingredient-name-${index}`}>
                            {ingredient.name}
                          </h3>
                          <Badge variant="secondary" className={config.color} data-testid={`ingredient-safety-${index}`}>
                            {config.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <p className="text-muted-foreground" data-testid={`ingredient-explanation-${index}`}>
                      {ingredient.explanation}
                    </p>
                    
                    {ingredient.sources.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Sources:</h4>
                        <div className="space-y-1">
                          {ingredient.sources.map((source, sourceIndex) => (
                            <a
                              key={sourceIndex}
                              href={source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-primary hover:underline"
                              data-testid={`ingredient-source-${index}-${sourceIndex}`}
                            >
                              <ExternalLink className="w-3 h-3" />
                              {source}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Save Analysis */}
          <Card>
            <CardContent className="p-6 text-center">
              <Button onClick={onSaveAnalysis} size="lg" data-testid="button-save-analysis">
                <Heart className="w-4 h-4 mr-2" />
                Save to My History
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Keep this analysis for future reference and comparison
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
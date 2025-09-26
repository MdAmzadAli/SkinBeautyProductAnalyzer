import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Camera, Upload, X, RotateCcw, CheckCircle, FileText, Zap, Plus, Trash2 } from "lucide-react";

interface Ingredient {
  name: string;
  amount: string | null;
}

interface CameraUploadProps {
  onAnalysisComplete: (ingredients: string[]) => void;
}

type Step = 'upload' | 'extract' | 'analyze';

export default function CameraUpload({ onAnalysisComplete }: CameraUploadProps) {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [extractedIngredients, setExtractedIngredients] = useState<Ingredient[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setCapturedFile(file);
      setCurrentStep('extract');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const clearImage = () => {
    setCapturedImage(null);
    setCapturedFile(null);
    setExtractedText("");
    setExtractedIngredients([]);
    setCurrentStep('upload');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleExtractIngredients = async () => {
    if (!capturedFile) return;

    setIsExtracting(true);
    try {
      const formData = new FormData();
      formData.append('image', capturedFile);

      const response = await fetch('/api/ocr-extract', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setExtractedText(result.originalText);
        setExtractedIngredients(result.ingredients || []);
        setCurrentStep('analyze');
      } else {
        console.error('Failed to extract ingredients');
        alert('Failed to extract ingredients. Please try again.');
      }
    } catch (error) {
      console.error('Error extracting ingredients:', error);
      alert('Error extracting ingredients. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAnalyzeIngredients = () => {
    setIsAnalyzing(true);
    
    // Get ingredient names from the edited list
    const ingredients = extractedIngredients
      .map(ingredient => ingredient.name.trim())
      .filter(ingredient => ingredient.length > 0);
    
    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      onAnalysisComplete(ingredients);
    }, 2000);
  };

  const updateIngredient = (index: number, field: 'name' | 'amount', value: string) => {
    const updated = [...extractedIngredients];
    updated[index] = { ...updated[index], [field]: value };
    setExtractedIngredients(updated);
  };

  const removeIngredient = (index: number) => {
    const updated = extractedIngredients.filter((_, i) => i !== index);
    setExtractedIngredients(updated);
  };

  const addIngredient = () => {
    setExtractedIngredients([...extractedIngredients, { name: '', amount: null }]);
  };

  const renderUploadStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Upload Ingredient Label
        </CardTitle>
        <p className="text-muted-foreground">
          Take a photo or upload an image of the ingredient list for analysis
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer hover-elevate ${
            dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={triggerFileInput}
          data-testid="dropzone-upload"
        >
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-muted-foreground" />
          </div>
          
          <h3 className="text-lg font-medium mb-2">Upload Product Image</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop an image or click to browse
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Badge variant="secondary">JPG</Badge>
            <Badge variant="secondary">PNG</Badge>
            <Badge variant="secondary">WEBP</Badge>
          </div>
          
          <Button variant="outline" type="button" data-testid="button-browse">
            <Upload className="w-4 h-4 mr-2" />
            Browse Files
          </Button>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
          accept="image/*"
          capture="environment"
          className="hidden"
          data-testid="input-file"
        />
      </CardContent>
    </Card>
  );

  const renderExtractStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Extract Ingredients
        </CardTitle>
        <p className="text-muted-foreground">
          Use OCR technology to extract ingredient names from your image
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border">
            <img
              src={capturedImage || ''}
              alt="Captured ingredient label"
              className="w-full h-64 object-cover"
              data-testid="img-captured"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2"
              onClick={clearImage}
              data-testid="button-clear-image"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={clearImage}
              className="flex-1"
              data-testid="button-retake"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Photo
            </Button>
            
            <Button
              onClick={handleExtractIngredients}
              disabled={isExtracting}
              className="flex-1"
              data-testid="button-extract"
            >
              {isExtracting ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Extracting...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Extract Ingredients
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderAnalyzeStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Review & Analyze
          </CardTitle>
          <p className="text-muted-foreground">
            Review the extracted ingredients and analyze them for safety
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border">
              <img
                src={capturedImage || ''}
                alt="Captured ingredient label"
                className="w-full h-48 object-cover"
                data-testid="img-captured-small"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2"
                onClick={clearImage}
                data-testid="button-clear-image-final"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {extractedText && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Raw OCR Text:</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {extractedText}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Extracted Ingredients (edit as needed):
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addIngredient}
                  data-testid="button-add-ingredient"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Ingredient
                </Button>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {extractedIngredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                        placeholder="Ingredient name"
                        className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                        data-testid={`input-ingredient-name-${index}`}
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="text"
                        value={ingredient.amount || ''}
                        onChange={(e) => updateIngredient(index, 'amount', e.target.value || null)}
                        placeholder="Amount"
                        className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                        data-testid={`input-ingredient-amount-${index}`}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                      className="flex-shrink-0"
                      data-testid={`button-remove-ingredient-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {extractedIngredients.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No ingredients extracted. Click "Add Ingredient" to add them manually.
                </p>
              )}
              
              <p className="text-xs text-muted-foreground">
                You can edit ingredient names and amounts, or add/remove ingredients as needed.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('extract')}
                className="flex-1"
                data-testid="button-back-extract"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Re-extract
              </Button>
              
              <Button
                onClick={handleAnalyzeIngredients}
                disabled={isAnalyzing || extractedIngredients.length === 0 || !extractedIngredients.some(ing => ing.name.trim())}
                className="flex-1"
                data-testid="button-analyze-final"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Analyze Ingredients
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {currentStep === 'upload' && renderUploadStep()}
      {currentStep === 'extract' && renderExtractStep()}
      {currentStep === 'analyze' && renderAnalyzeStep()}
    </div>
  );
}
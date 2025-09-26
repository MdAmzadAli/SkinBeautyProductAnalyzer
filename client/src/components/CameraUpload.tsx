import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, X, RotateCcw, CheckCircle } from "lucide-react";

interface CameraUploadProps {
  onImageCapture: (file: File) => void;
  onAnalyze: () => void;
  isAnalyzing?: boolean;
}

export default function CameraUpload({ onImageCapture, onAnalyze, isAnalyzing = false }: CameraUploadProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageCapture(file);
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
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
          {!capturedImage ? (
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
                <Badge variant="secondary">HEIC</Badge>
              </div>
              
              <Button variant="outline" type="button" data-testid="button-browse">
                <Upload className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border">
                <img
                  src={capturedImage}
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
                  onClick={onAnalyze}
                  disabled={isAnalyzing}
                  className="flex-1"
                  data-testid="button-analyze"
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
          )}
          
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
    </div>
  );
}
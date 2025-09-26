import CameraUpload from '../CameraUpload';

export default function CameraUploadExample() {
  const handleImageCapture = (file: File) => {
    console.log('Image captured:', file.name, file.size);
  };

  const handleAnalyze = () => {
    console.log('Starting analysis...');
    // Simulate analysis
    setTimeout(() => {
      alert('Analysis complete! This would show ingredient results.');
    }, 2000);
  };

  return (
    <div className="p-6 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Ingredient Analysis</h1>
          <p className="text-muted-foreground">
            Upload a clear photo of the ingredient list for AI-powered analysis
          </p>
        </div>
        <CameraUpload 
          onImageCapture={handleImageCapture} 
          onAnalyze={handleAnalyze}
          isAnalyzing={false}
        />
      </div>
    </div>
  );
}
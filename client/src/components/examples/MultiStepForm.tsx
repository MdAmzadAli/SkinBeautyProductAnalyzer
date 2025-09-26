import MultiStepForm from '../MultiStepForm';

export default function MultiStepFormExample() {
  const handleComplete = (data: any) => {
    console.log('Form completed with data:', data);
    alert('Profile completed! This would normally save to the database.');
  };

  return (
    <div className="p-6 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Skin Profile</h1>
          <p className="text-muted-foreground">
            Help us understand your skin better for personalized ingredient analysis
          </p>
        </div>
        <MultiStepForm onComplete={handleComplete} />
      </div>
    </div>
  );
}
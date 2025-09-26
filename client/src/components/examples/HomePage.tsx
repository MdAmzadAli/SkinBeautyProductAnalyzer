import HomePage from '../HomePage';

export default function HomePageExample() {
  //todo: remove mock functionality - replace with real user data from backend
  const mockUserStats = {
    analyzedProducts: 12,
    safeProducts: 8,
    profileComplete: true
  };

  const handleNavigate = (view: string) => {
    console.log('Navigating to:', view);
    alert(`Navigation to ${view} page. In the real app, this would change the current view.`);
  };

  return (
    <div className="p-6 min-h-screen bg-background">
      <HomePage 
        onNavigate={handleNavigate}
        userStats={mockUserStats}
      />
    </div>
  );
}
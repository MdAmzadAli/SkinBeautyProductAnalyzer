import { useState } from "react";
import Navigation from '../Navigation';

export default function NavigationExample() {
  const [currentView, setCurrentView] = useState('home');

  const handleNavigate = (view: string) => {
    console.log('Navigating to:', view);
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} onNavigate={handleNavigate} />
      
      <main className="p-6 pb-24 md:pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Current View: {currentView}</h2>
            <p className="text-muted-foreground">
              Use the navigation to switch between different sections of the app.
              Try both desktop and mobile views to see responsive behavior.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
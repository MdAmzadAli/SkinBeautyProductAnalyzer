import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Camera, 
  History, 
  User, 
  Home,
  Menu,
  X,
  Sun,
  Moon
} from "lucide-react";

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  hasEnteredApp: boolean;
  hasProfile: boolean;
  onGetStarted: () => void;
}

export default function Navigation({ currentView, onNavigate, hasEnteredApp, hasProfile, onGetStarted }: NavigationProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    console.log('Dark mode toggled:', !isDarkMode);
  };

  // Determine which nav items to show based on state
  const getNavItems = () => {
    if (!hasEnteredApp) {
      return []; // No nav items before entering app
    }
    
    if (!hasProfile) {
      return []; // No nav items during profile creation
    }
    
    // Full nav after profile creation
    return [
      { id: 'camera', label: 'Analyze', icon: Camera },
      { id: 'history', label: 'History', icon: History },
      { id: 'profile', label: 'Profile', icon: User }
    ];
  };
  
  const navItems = getNavItems();

  const handleNavigate = (view: string) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <h1 className="text-xl font-bold">SkinSense</h1>
        </div>

        <nav className="flex items-center gap-1">
          {!hasEnteredApp && (
            <Button
              onClick={onGetStarted}
              className="gap-2"
              data-testid="nav-get-started"
            >
              Get Started
            </Button>
          )}
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                onClick={() => handleNavigate(item.id)}
                className="gap-2"
                data-testid={`nav-${item.id}`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          data-testid="button-theme-toggle"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <h1 className="text-lg font-bold">SkinSense</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            data-testid="button-mobile-theme-toggle"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[73px] bg-background border-b z-40">
          <nav className="p-4 space-y-2">
            {!hasEnteredApp && (
              <Button
                onClick={onGetStarted}
                className="w-full justify-start gap-3"
                data-testid="mobile-nav-get-started"
              >
                Get Started
              </Button>
            )}
            
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => handleNavigate(item.id)}
                  className="w-full justify-start gap-3"
                  data-testid={`mobile-nav-${item.id}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {/* Mobile Bottom Navigation */}
      {navItems.length > 0 && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-40">
          <div className={`grid gap-1 p-2 ${navItems.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => handleNavigate(item.id)}
                  className="flex-col h-16 gap-1"
                  size="sm"
                  data-testid={`bottom-nav-${item.id}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
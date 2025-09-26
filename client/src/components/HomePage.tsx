import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Shield, 
  Zap, 
  Heart,
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp
} from "lucide-react";
import heroImage from '@assets/generated_images/Skincare_app_interface_mockup_28486f82.png';

interface HomePageProps {
  onNavigate: (view: string) => void;
  userStats?: {
    analyzedProducts: number;
    safeProducts: number;
    profileComplete: boolean;
  };
}

export default function HomePage({ onNavigate, userStats }: HomePageProps) {
  const features = [
    {
      icon: Shield,
      title: "AI-Powered Analysis",
      description: "Advanced ingredient analysis using Google Gemini AI for accurate safety ratings"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get detailed ingredient breakdown in seconds with OCR technology"
    },
    {
      icon: Heart,
      title: "Personalized for You",
      description: "Tailored recommendations based on your unique skin profile and concerns"
    }
  ];

  const quickActions = [
    {
      id: 'camera',
      title: 'Analyze Product',
      description: 'Scan ingredient labels instantly',
      icon: Camera,
      color: 'bg-primary text-primary-foreground'
    },
    {
      id: 'profile',
      title: 'Update Profile',
      description: 'Complete your skin assessment',
      icon: Users,
      color: 'bg-secondary text-secondary-foreground'
    },
    {
      id: 'history',
      title: 'View History',
      description: 'Track your skincare journey',
      icon: TrendingUp,
      color: 'bg-accent text-accent-foreground'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <Badge className="w-fit">
                AI-Powered Skincare Analysis
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Know Your
                <span className="block text-primary">Ingredients</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Upload product labels and get instant AI-powered analysis. 
                Discover which ingredients work best for your unique skin profile.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => onNavigate('camera')}
                data-testid="button-hero-analyze"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Analysis
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => onNavigate('profile')}
                data-testid="button-hero-profile"
              >
                Complete Profile
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <img
              src={heroImage}
              alt="SkinSense app interface"
              className="w-full h-auto rounded-lg shadow-lg"
              data-testid="img-hero"
            />
          </div>
        </div>
      </div>

      {/* User Stats */}
      {userStats && (
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary" data-testid="stat-analyzed">
                  {userStats.analyzedProducts}
                </div>
                <div className="text-sm text-muted-foreground">Products Analyzed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600" data-testid="stat-safe">
                  {userStats.safeProducts}
                </div>
                <div className="text-sm text-muted-foreground">Safe Products</div>
              </div>
              <div>
                <div className="flex items-center justify-center">
                  {userStats.profileComplete ? (
                    <CheckCircle className="w-6 h-6 text-green-600" data-testid="icon-profile-complete" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-muted" data-testid="icon-profile-incomplete" />
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Profile Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          
          return (
            <Card 
              key={action.id} 
              className="cursor-pointer hover-elevate transition-all"
              onClick={() => onNavigate(action.id)}
              data-testid={`card-action-${action.id}`}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className={`w-12 h-12 mx-auto rounded-lg ${action.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Why Choose SkinSense?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our advanced AI technology provides personalized skincare recommendations 
            based on your unique skin profile and the latest dermatological research.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold">Ready to Transform Your Skincare?</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Join thousands of users who've discovered their perfect skincare routine with AI-powered analysis.
          </p>
          <Button 
            size="lg" 
            onClick={() => onNavigate('camera')}
            data-testid="button-cta-analyze"
          >
            <Camera className="w-5 h-5 mr-2" />
            Analyze Your First Product
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
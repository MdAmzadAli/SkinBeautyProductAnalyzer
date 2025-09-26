import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FormData {
  skinType: string;
  concerns: string[];
  allergies: string[];
  lifestyle: string[];
  additionalInfo: string;
}

interface MultiStepFormProps {
  onComplete: (data: FormData) => void;
}

const STEPS = [
  { id: 1, title: "Skin Type", description: "What's your primary skin type?" },
  { id: 2, title: "Concerns", description: "What are your main skin concerns?" },
  { id: 3, title: "Allergies", description: "Any ingredient sensitivities?" },
  { id: 4, title: "Lifestyle", description: "Your daily environment & habits" },
  { id: 5, title: "Additional Info", description: "Anything else we should know?" }
];

const SKIN_TYPES = [
  { id: "normal", label: "Normal", desc: "Balanced, not too oily or dry" },
  { id: "oily", label: "Oily", desc: "Shiny, large pores, prone to acne" },
  { id: "dry", label: "Dry", desc: "Tight, flaky, rough texture" },
  { id: "combination", label: "Combination", desc: "Oily T-zone, dry cheeks" },
  { id: "sensitive", label: "Sensitive", desc: "Easily irritated, reactive" }
];

const CONCERNS = [
  { id: "acne", label: "Acne & Breakouts" },
  { id: "pigmentation", label: "Dark Spots & Pigmentation" },
  { id: "aging", label: "Fine Lines & Aging" },
  { id: "dryness", label: "Dryness & Dehydration" },
  { id: "redness", label: "Redness & Inflammation" },
  { id: "pores", label: "Large Pores" },
  { id: "dullness", label: "Dull Complexion" }
];

const ALLERGIES = [
  { id: "fragrance", label: "Fragrance & Essential Oils" },
  { id: "parabens", label: "Parabens" },
  { id: "sulfates", label: "Sulfates" },
  { id: "alcohol", label: "Denatured Alcohol" },
  { id: "retinoids", label: "Retinoids" },
  { id: "acids", label: "Alpha/Beta Hydroxy Acids" },
  { id: "none", label: "No Known Allergies" }
];

const LIFESTYLE = [
  { id: "high-sun", label: "High Sun Exposure" },
  { id: "pollution", label: "Urban Pollution" },
  { id: "ac-environment", label: "Air Conditioned Environment" },
  { id: "stress", label: "High Stress Levels" },
  { id: "poor-diet", label: "Irregular Diet" },
  { id: "smoking", label: "Smoking" },
  { id: "exercise", label: "Regular Exercise" }
];

export default function MultiStepForm({ onComplete }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    skinType: "",
    concerns: [],
    allergies: [],
    lifestyle: [],
    additionalInfo: ""
  });

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1: return formData.skinType !== "";
      case 2: return formData.concerns.length > 0;
      case 3: return formData.allergies.length > 0;
      case 4: return formData.lifestyle.length > 0;
      case 5: return true; // Optional step
      default: return false;
    }
  };

  const handleCheckboxChange = (field: keyof FormData, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <RadioGroup 
            value={formData.skinType} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, skinType: value }))}
            className="gap-4"
          >
            {SKIN_TYPES.map((type) => (
              <div key={type.id} className="flex items-start space-x-3 rounded-md border p-4 hover-elevate">
                <RadioGroupItem value={type.id} id={type.id} data-testid={`radio-skintype-${type.id}`} />
                <div className="grid gap-1.5 leading-none flex-1">
                  <Label htmlFor={type.id} className="font-medium text-base cursor-pointer">
                    {type.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{type.desc}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        );

      case 2:
        return (
          <div className="grid gap-4">
            {CONCERNS.map((concern) => (
              <div key={concern.id} className="flex items-center space-x-3 rounded-md border p-4 hover-elevate">
                <Checkbox
                  id={concern.id}
                  checked={formData.concerns.includes(concern.id)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("concerns", concern.id, checked as boolean)
                  }
                  data-testid={`checkbox-concern-${concern.id}`}
                />
                <Label htmlFor={concern.id} className="font-medium cursor-pointer flex-1">
                  {concern.label}
                </Label>
              </div>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="grid gap-4">
            {ALLERGIES.map((allergy) => (
              <div key={allergy.id} className="flex items-center space-x-3 rounded-md border p-4 hover-elevate">
                <Checkbox
                  id={allergy.id}
                  checked={formData.allergies.includes(allergy.id)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("allergies", allergy.id, checked as boolean)
                  }
                  data-testid={`checkbox-allergy-${allergy.id}`}
                />
                <Label htmlFor={allergy.id} className="font-medium cursor-pointer flex-1">
                  {allergy.label}
                </Label>
              </div>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="grid gap-4">
            {LIFESTYLE.map((factor) => (
              <div key={factor.id} className="flex items-center space-x-3 rounded-md border p-4 hover-elevate">
                <Checkbox
                  id={factor.id}
                  checked={formData.lifestyle.includes(factor.id)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("lifestyle", factor.id, checked as boolean)
                  }
                  data-testid={`checkbox-lifestyle-${factor.id}`}
                />
                <Label htmlFor={factor.id} className="font-medium cursor-pointer flex-1">
                  {factor.label}
                </Label>
              </div>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <Textarea
              placeholder="Share any additional concerns, current skincare routine, or specific ingredients you're curious about..."
              value={formData.additionalInfo}
              onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
              className="min-h-[120px]"
              data-testid="textarea-additional-info"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / STEPS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Step {currentStep} of {STEPS.length}</span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
        <Progress value={progressPercentage} className="h-2" data-testid="progress-form" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{STEPS[currentStep - 1].title}</CardTitle>
          <p className="text-muted-foreground">{STEPS[currentStep - 1].description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStepContent()}
          
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              data-testid="button-back"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!isStepComplete()}
              data-testid="button-next"
            >
              {currentStep === STEPS.length ? "Complete Profile" : "Next"}
              {currentStep < STEPS.length && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
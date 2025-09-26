import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Edit3, Save, X } from "lucide-react";

interface ProfileData {
  skinType: string;
  concerns: string[];
  allergies: string[];
  lifestyle: string[];
  additionalInfo: string;
}

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

export default function ProfileView() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editData, setEditData] = useState<ProfileData>({
    skinType: "",
    concerns: [],
    allergies: [],
    lifestyle: [],
    additionalInfo: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditData(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (field: string) => {
    setEditingField(field);
  };

  const handleSave = async (field: string) => {
    setSaving(true);
    try {
      const updateData = { [field]: editData[field as keyof ProfileData] };
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...profile, ...updateData }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setEditingField(null);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditData(profile);
    }
    setEditingField(null);
  };

  const handleCheckboxChange = (field: 'concerns' | 'allergies' | 'lifestyle', value: string, checked: boolean) => {
    setEditData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const getSkinTypeLabel = (id: string) => {
    return SKIN_TYPES.find(type => type.id === id)?.label || id;
  };

  const getItemLabel = (items: typeof CONCERNS | typeof ALLERGIES | typeof LIFESTYLE, id: string) => {
    return items.find(item => item.id === id)?.label || id;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading your profile...</h2>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No profile found</h2>
          <p className="text-muted-foreground">Please create your profile first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Your Skin Profile</h1>
        <p className="text-muted-foreground">
          View and edit your personalized skin profile
        </p>
      </div>

      {/* Skin Type */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">Skin Type</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit('skinType')}
            disabled={editingField !== null}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {editingField === 'skinType' ? (
            <div className="space-y-4">
              <RadioGroup 
                value={editData.skinType} 
                onValueChange={(value) => setEditData(prev => ({ ...prev, skinType: value }))}
                className="gap-4"
              >
                {SKIN_TYPES.map((type) => (
                  <div key={type.id} className="flex items-start space-x-3 rounded-md border p-4">
                    <RadioGroupItem value={type.id} id={type.id} />
                    <div className="grid gap-1.5 leading-none flex-1">
                      <Label htmlFor={type.id} className="font-medium cursor-pointer">
                        {type.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{type.desc}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSave('skinType')} 
                  disabled={saving}
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Badge variant="outline" className="text-base px-3 py-1">
              {getSkinTypeLabel(profile.skinType)}
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Concerns */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">Skin Concerns</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit('concerns')}
            disabled={editingField !== null}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {editingField === 'concerns' ? (
            <div className="space-y-4">
              <div className="grid gap-4">
                {CONCERNS.map((concern) => (
                  <div key={concern.id} className="flex items-center space-x-3 rounded-md border p-4">
                    <Checkbox
                      id={concern.id}
                      checked={editData.concerns.includes(concern.id)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("concerns", concern.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={concern.id} className="font-medium cursor-pointer flex-1">
                      {concern.label}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSave('concerns')} 
                  disabled={saving}
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.concerns.map((concern) => (
                <Badge key={concern} variant="outline">
                  {getItemLabel(CONCERNS, concern)}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Allergies */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">Allergies & Sensitivities</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit('allergies')}
            disabled={editingField !== null}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {editingField === 'allergies' ? (
            <div className="space-y-4">
              <div className="grid gap-4">
                {ALLERGIES.map((allergy) => (
                  <div key={allergy.id} className="flex items-center space-x-3 rounded-md border p-4">
                    <Checkbox
                      id={allergy.id}
                      checked={editData.allergies.includes(allergy.id)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("allergies", allergy.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={allergy.id} className="font-medium cursor-pointer flex-1">
                      {allergy.label}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSave('allergies')} 
                  disabled={saving}
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map((allergy) => (
                <Badge key={allergy} variant="outline">
                  {getItemLabel(ALLERGIES, allergy)}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lifestyle */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">Lifestyle Factors</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit('lifestyle')}
            disabled={editingField !== null}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {editingField === 'lifestyle' ? (
            <div className="space-y-4">
              <div className="grid gap-4">
                {LIFESTYLE.map((factor) => (
                  <div key={factor.id} className="flex items-center space-x-3 rounded-md border p-4">
                    <Checkbox
                      id={factor.id}
                      checked={editData.lifestyle.includes(factor.id)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("lifestyle", factor.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={factor.id} className="font-medium cursor-pointer flex-1">
                      {factor.label}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSave('lifestyle')} 
                  disabled={saving}
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.lifestyle.map((factor) => (
                <Badge key={factor} variant="outline">
                  {getItemLabel(LIFESTYLE, factor)}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">Additional Information</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit('additionalInfo')}
            disabled={editingField !== null}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {editingField === 'additionalInfo' ? (
            <div className="space-y-4">
              <Textarea
                value={editData.additionalInfo}
                onChange={(e) => setEditData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                placeholder="Share any additional concerns, current skincare routine, or specific ingredients you're curious about..."
                className="min-h-[120px]"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSave('additionalInfo')} 
                  disabled={saving}
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              {profile.additionalInfo || "No additional information provided."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
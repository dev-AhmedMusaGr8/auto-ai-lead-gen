
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const Dealership = () => {
  const { setCurrentStep, dealershipName, setDealershipName, dealershipSize, setDealershipSize } = useOnboarding();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!dealershipName.trim()) {
      setError("Please enter your dealership name");
      return;
    }
    
    setError("");
    setCurrentStep('inventory');
    navigate('/onboarding/inventory');
  };

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-kepli-darkGray mb-4">
          Tell us about your dealership
        </h1>
        <p className="text-kepli-gray text-lg mb-8">
          This helps us customize your experience and provide relevant recommendations.
        </p>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="dealershipName">Dealership Name</Label>
            <Input
              id="dealershipName"
              placeholder="Enter your dealership name"
              value={dealershipName}
              onChange={(e) => setDealershipName(e.target.value)}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          
          <div className="space-y-3">
            <Label>Dealership Size</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['Small (1-10)', 'Medium (11-30)', 'Large (30+)'].map((size) => (
                <Card 
                  key={size} 
                  className={`cursor-pointer transition-all hover:shadow-md ${dealershipSize === size ? 'border-[#8B5CF6] shadow-md' : ''}`}
                  onClick={() => setDealershipSize(size)}
                >
                  <CardContent className="p-4 flex items-center justify-center">
                    <p className="font-medium text-center">{size}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Primary Business Focus</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {['New Vehicles', 'Used Vehicles', 'Both', 'Service & Parts'].map((focus) => (
                <Card key={focus} className="cursor-pointer transition-all hover:shadow-md">
                  <CardContent className="p-4 flex items-center justify-center">
                    <p className="font-medium text-center">{focus}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        <Button
          onClick={handleContinue}
          className="mt-10 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-md px-6 py-2 h-12 font-medium flex items-center justify-center gap-2 w-full md:w-auto"
        >
          Continue
          <ArrowRight size={16} />
        </Button>
      </div>
      
      <div className="hidden md:flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1626180738812-4db4936bbc8e?w=800&auto=format&fit=crop&q=80" 
          alt="Modern car dealership" 
          className="rounded-lg shadow-xl max-w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};

export default Dealership;

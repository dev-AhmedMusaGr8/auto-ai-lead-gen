
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Upload, Database, FileSpreadsheet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Inventory = () => {
  const { setCurrentStep } = useOnboarding();
  const navigate = useNavigate();

  const handleContinue = () => {
    setCurrentStep('team');
    navigate('/onboarding/team');
  };

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-kepli-darkGray mb-4">
          Set up your inventory
        </h1>
        <p className="text-kepli-gray text-lg mb-8">
          Choose how you'd like to add your vehicle inventory to AutoCRMAI.
        </p>
        
        <div className="space-y-4">
          <Card className="cursor-pointer transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-[#8B5CF6]/10">
                  <Upload className="h-6 w-6 text-[#8B5CF6]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Import from CSV</h3>
                  <p className="text-kepli-gray">Upload a CSV file with your vehicle data</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-[#8B5CF6]/10">
                  <Database className="h-6 w-6 text-[#8B5CF6]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Connect Your DMS</h3>
                  <p className="text-kepli-gray">Sync with your Dealer Management System</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-[#8B5CF6]/10">
                  <FileSpreadsheet className="h-6 w-6 text-[#8B5CF6]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Start from Scratch</h3>
                  <p className="text-kepli-gray">Manually add vehicles to your inventory</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <p className="text-kepli-gray mt-4 text-sm">
          You can always import or connect your inventory later.
        </p>
        
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
          src="https://images.unsplash.com/photo-1613569443889-40a3409e7294?w=800&auto=format&fit=crop&q=80" 
          alt="Car inventory management" 
          className="rounded-lg shadow-xl max-w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};

export default Inventory;

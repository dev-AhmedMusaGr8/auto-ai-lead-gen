
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Welcome = () => {
  const { setCurrentStep } = useOnboarding();
  const navigate = useNavigate();

  const handleContinue = () => {
    setCurrentStep('dealership');
    navigate('/onboarding/dealership');
  };

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-kepli-darkGray mb-6">
          Welcome to AutoCRMAI
        </h1>
        <p className="text-kepli-gray text-lg mb-8">
          We're excited to help you transform your dealership operations. Let's set up your account in just a few steps.
        </p>
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
              1
            </div>
            <div>
              <h3 className="font-medium text-kepli-darkGray">Dealership Setup</h3>
              <p className="text-kepli-gray">Configure your dealership information</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
              2
            </div>
            <div>
              <h3 className="font-medium text-kepli-darkGray">Inventory Management</h3>
              <p className="text-kepli-gray">Import or set up your vehicle inventory</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
              3
            </div>
            <div>
              <h3 className="font-medium text-kepli-darkGray">Team Collaboration</h3>
              <p className="text-kepli-gray">Invite team members to collaborate</p>
            </div>
          </div>
        </div>
        
        <Button
          onClick={handleContinue}
          className="mt-10 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-md px-6 py-2 h-12 font-medium flex items-center justify-center gap-2 w-full md:w-auto"
        >
          Get Started
          <ArrowRight size={16} />
        </Button>
      </div>
      
      <div className="hidden md:flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80" 
          alt="Woman using laptop with dashboard" 
          className="rounded-lg shadow-xl max-w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};

export default Welcome;

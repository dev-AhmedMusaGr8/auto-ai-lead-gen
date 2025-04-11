
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";

const Complete = () => {
  const { completeOnboarding } = useOnboarding();
  const navigate = useNavigate();

  const handleFinish = () => {
    completeOnboarding();
    navigate('/dashboard');
  };

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div className="flex flex-col justify-center">
        <div className="mb-8 flex justify-center md:justify-start">
          <div className="p-4 bg-green-100 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-kepli-darkGray mb-4">
          You're all set!
        </h1>
        <p className="text-kepli-gray text-lg mb-8">
          Your AutoCRMAI account is now ready. Let's start managing your dealership operations with AI-powered insights.
        </p>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-5">
            <h3 className="font-semibold text-lg mb-4">Here's what you can do next:</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 bg-[#8B5CF6]/10 p-1 rounded-full">
                  <CheckCircle className="h-4 w-4 text-[#8B5CF6]" />
                </div>
                <p>Complete your dealership profile with location and business hours</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 bg-[#8B5CF6]/10 p-1 rounded-full">
                  <CheckCircle className="h-4 w-4 text-[#8B5CF6]" />
                </div>
                <p>Import your customer database to activate AI-powered insights</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 bg-[#8B5CF6]/10 p-1 rounded-full">
                  <CheckCircle className="h-4 w-4 text-[#8B5CF6]" />
                </div>
                <p>Customize your sales pipeline stages to match your workflow</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 bg-[#8B5CF6]/10 p-1 rounded-full">
                  <CheckCircle className="h-4 w-4 text-[#8B5CF6]" />
                </div>
                <p>Set up automated follow-ups and customer communication templates</p>
              </li>
            </ul>
          </div>
        </div>
        
        <Button
          onClick={handleFinish}
          className="mt-10 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-md px-6 py-2 h-12 font-medium flex items-center justify-center gap-2 w-full md:w-auto"
        >
          Go to Dashboard
          <ArrowRight size={16} />
        </Button>
      </div>
      
      <div className="hidden md:flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1560438718-eb61ede255eb?w=800&auto=format&fit=crop&q=80" 
          alt="Ready to start" 
          className="rounded-lg shadow-xl max-w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};

export default Complete;

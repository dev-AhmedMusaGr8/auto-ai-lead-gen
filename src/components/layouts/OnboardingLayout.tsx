
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

const OnboardingLayout = () => {
  const { currentStep } = useOnboarding();
  const navigate = useNavigate();

  const handleBack = () => {
    switch (currentStep) {
      case 'welcome':
        navigate('/signin');
        break;
      case 'dealership':
        navigate('/onboarding/welcome');
        break;
      case 'inventory':
        navigate('/onboarding/dealership');
        break;
      case 'team':
        navigate('/onboarding/inventory');
        break;
      case 'complete':
        navigate('/onboarding/team');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Logo and progress header */}
      <header className="py-4 px-6 border-b bg-white">
        <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center">
            <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="6" fill="#6366F1" />
              <path d="M7.5 7.5H12.5L16.5 12L12.5 16.5H7.5V7.5Z" fill="white" />
            </svg>
            <span className="text-xl font-bold text-kepli-darkGray">AutoCRMAI</span>
          </div>
          
          {/* Progress indicators */}
          <div className="hidden md:flex items-center space-x-2">
            <div className={`h-2 w-10 rounded-full ${currentStep !== 'welcome' ? 'bg-[#8B5CF6]' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-10 rounded-full ${currentStep !== 'welcome' && currentStep !== 'dealership' ? 'bg-[#8B5CF6]' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-10 rounded-full ${currentStep !== 'welcome' && currentStep !== 'dealership' && currentStep !== 'inventory' ? 'bg-[#8B5CF6]' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-10 rounded-full ${currentStep === 'complete' ? 'bg-[#8B5CF6]' : 'bg-gray-200'}`}></div>
          </div>

          {/* Skip link */}
          {currentStep !== 'complete' && (
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-sm text-gray-500 hover:text-[#8B5CF6]"
            >
              Skip
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <Outlet />
        </div>
      </main>

      {/* Navigation footer */}
      <footer className="py-4 px-6 border-t bg-white">
        <div className="max-w-6xl mx-auto w-full flex justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingLayout;

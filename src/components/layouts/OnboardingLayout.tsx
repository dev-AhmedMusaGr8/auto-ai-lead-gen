
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const OnboardingLayout = () => {
  const { currentStep, progress, goBack } = useOnboarding();
  const navigate = useNavigate();

  const handleBack = () => {
    goBack();
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
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="6" fill="#6366F1" />
                <path d="M7.5 7.5H12.5L16.5 12L12.5 16.5H7.5V7.5Z" fill="white" />
              </svg>
              <span className="text-xl font-bold text-gray-800">AutoCRMAI</span>
            </div>
            
            {/* Skip link */}
            {currentStep !== 'complete' && (
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-sm text-gray-500 hover:text-[#8B5CF6] transition-colors"
              >
                Skip
              </button>
            )}
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#8B5CF6]" 
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            ></motion.div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-xl shadow-sm"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 border-t bg-white">
        <div className="max-w-6xl mx-auto w-full flex justify-between">
          {currentStep !== 'welcome' && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default OnboardingLayout;

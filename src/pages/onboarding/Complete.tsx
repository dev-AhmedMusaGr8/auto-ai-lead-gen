
import { useEffect } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Complete = () => {
  const { setCurrentStep, completeOnboarding } = useOnboarding();
  const navigate = useNavigate();

  // Ensure we're on the correct onboarding step
  useEffect(() => {
    setCurrentStep('complete');
  }, [setCurrentStep]);

  const handleFinish = async () => {
    // Save onboarding data to database and mark as complete
    await completeOnboarding();
    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="space-y-8 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.2
        }}
        className="mx-auto bg-green-100 rounded-full p-4 w-20 h-20 flex items-center justify-center"
      >
        <Check className="w-10 h-10 text-green-600" />
      </motion.div>

      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          You're all set!
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Your dealership has been successfully configured. You can now start using AutoCRMAI to manage your business.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-50 p-5 rounded-lg max-w-md mx-auto"
      >
        <h3 className="font-medium text-lg mb-3">What's next?</h3>
        <ul className="text-left space-y-3">
          <li className="flex items-start gap-3">
            <div className="bg-[#8B5CF6]/10 rounded-full p-1 mt-0.5">
              <Check className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <span>Customize your dashboard based on your role</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="bg-[#8B5CF6]/10 rounded-full p-1 mt-0.5">
              <Check className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <span>Import your customer data and inventory</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="bg-[#8B5CF6]/10 rounded-full p-1 mt-0.5">
              <Check className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <span>Set up integrations with your existing tools</span>
          </li>
        </ul>
      </motion.div>

      <Button
        onClick={handleFinish}
        className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium"
      >
        Go to Dashboard
        <ArrowRight size={16} className="ml-2" />
      </Button>
    </div>
  );
};

export default Complete;

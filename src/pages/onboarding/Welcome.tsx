
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Welcome = () => {
  const { setCurrentStep } = useOnboarding();
  const navigate = useNavigate();
  const { profile } = useAuth();

  // Ensure we're on the correct onboarding step
  useEffect(() => {
    setCurrentStep('welcome');
  }, [setCurrentStep]);

  const handleContinue = () => {
    setCurrentStep('dealership');
    navigate('/onboarding/dealership');
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.3 
      }
    })
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Welcome {profile?.full_name ? `${profile.full_name}` : ''} to AutoCRMAI
        </h1>
        <p className="text-gray-600">
          Let's set up your dealership in just a few quick steps. This will help us tailor the experience to your specific needs.
        </p>
      </div>

      <div className="space-y-5 py-2">
        {[
          {
            step: 1,
            title: "Dealership Setup",
            description: "Configure your dealership information and size"
          },
          {
            step: 2,
            title: "Inventory Management",
            description: "Choose how you want to manage your vehicle inventory"
          },
          {
            step: 3,
            title: "Team Collaboration",
            description: "Invite your team members to collaborate"
          }
        ].map((item, i) => (
          <motion.div
            key={item.step}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={stepVariants}
            className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-purple-100 hover:bg-purple-50/30 transition-all"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
              {item.step}
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="pt-4">
        <Button
          onClick={handleContinue}
          className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium w-full sm:w-auto"
        >
          Get Started
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Welcome;

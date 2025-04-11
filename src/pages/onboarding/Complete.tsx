
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, ExternalLink, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const Complete = () => {
  const { completeOnboarding, dealershipName, goBack } = useOnboarding();
  const navigate = useNavigate();

  const handleFinish = () => {
    completeOnboarding();
    navigate('/dashboard');
  };

  const handleBack = () => {
    goBack();
    navigate('/onboarding/team');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const successVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        duration: 0.8
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 text-center sm:text-left"
    >
      <motion.div 
        variants={successVariants}
        className="mb-6 flex justify-center sm:justify-start"
      >
        <div className="p-4 bg-green-100 rounded-full">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          {dealershipName ? `${dealershipName} is ready to go!` : "You're all set!"}
        </h1>
        <p className="text-gray-600">
          Your AutoCRMAI account is now ready. Let's start managing your dealership operations with AI-powered insights.
        </p>
      </motion.div>
      
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="bg-white rounded-lg border p-5">
          <h3 className="font-semibold text-lg mb-4 text-gray-800">Here's what you can do next:</h3>
          <ul className="space-y-4">
            {[
              "Complete your dealership profile with location and business hours",
              "Import your customer database to activate AI-powered insights",
              "Customize your sales pipeline stages to match your workflow",
              "Set up automated follow-ups and customer communication templates"
            ].map((item, index) => (
              <motion.li 
                key={index}
                className="flex items-start gap-3"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { 
                    opacity: 1, 
                    x: 0,
                    transition: { duration: 0.4, delay: 0.1 * index }
                  }
                }}
              >
                <div className="mt-0.5 flex-shrink-0 bg-[#8B5CF6]/10 p-1 rounded-full">
                  <CheckCircle className="h-4 w-4 text-[#8B5CF6]" />
                </div>
                <p className="text-gray-700">{item}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
      
      <motion.div
        variants={itemVariants}
        className="pt-4 flex flex-col sm:flex-row gap-4 items-center"
      >
        <Button
          variant="outline"
          onClick={handleBack}
          className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10 w-full sm:w-auto"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        
        <Button
          onClick={handleFinish}
          className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium w-full sm:w-auto"
        >
          Go to Dashboard
          <ArrowRight size={16} />
        </Button>
        
        <Button
          variant="outline"
          className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10 w-full sm:w-auto"
        >
          Watch Tutorial
          <ExternalLink size={16} />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Complete;

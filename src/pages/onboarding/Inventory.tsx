
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Upload, Database, FileSpreadsheet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const Inventory = () => {
  const { setCurrentStep } = useOnboarding();
  const navigate = useNavigate();

  const handleContinue = () => {
    setCurrentStep('team');
    navigate('/onboarding/team');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Set up your inventory
        </h1>
        <p className="text-gray-600">
          Choose how you'd like to add your vehicle inventory to AutoCRMAI. You can always change this later.
        </p>
      </motion.div>
      
      <motion.div variants={itemVariants} className="space-y-4">
        {[
          {
            icon: <Upload className="h-6 w-6 text-[#8B5CF6]" />,
            title: "Import from CSV",
            description: "Upload a CSV file with your vehicle data"
          },
          {
            icon: <Database className="h-6 w-6 text-[#8B5CF6]" />,
            title: "Connect Your DMS",
            description: "Sync with your Dealer Management System"
          },
          {
            icon: <FileSpreadsheet className="h-6 w-6 text-[#8B5CF6]" />,
            title: "Start from Scratch",
            description: "Manually add vehicles to your inventory"
          }
        ].map((item, index) => (
          <Card 
            key={index} 
            className="cursor-pointer transition-all hover:shadow-sm hover:border-[#8B5CF6]/70"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-[#8B5CF6]/10">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-800">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <p className="text-gray-500 text-sm italic">
          You can always import or connect your inventory later in the settings.
        </p>
      </motion.div>
      
      <motion.div variants={itemVariants} className="pt-4">
        <Button
          onClick={handleContinue}
          className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium w-full sm:w-auto"
        >
          Continue
          <ArrowRight size={16} />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Inventory;

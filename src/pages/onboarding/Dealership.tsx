
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Building, Store, Warehouse, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const Dealership = () => {
  const { setCurrentStep, dealershipName, setDealershipName, dealershipSize, setDealershipSize, goBack } = useOnboarding();
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

  const handleBack = () => {
    goBack();
    navigate('/onboarding/welcome');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
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
          Tell us about your dealership
        </h1>
        <p className="text-gray-600">
          This helps us customize your experience and provide relevant features for your business.
        </p>
      </motion.div>
      
      <div className="space-y-6">
        <motion.div variants={itemVariants} className="space-y-3">
          <Label htmlFor="dealershipName">Dealership Name</Label>
          <Input
            id="dealershipName"
            placeholder="Enter your dealership name"
            value={dealershipName}
            onChange={(e) => setDealershipName(e.target.value)}
            className={error ? "border-red-500 focus-visible:ring-red-400" : ""}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-3">
          <Label>Dealership Size</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { size: 'Small (1-10)', icon: <Store size={20} /> },
              { size: 'Medium (11-30)', icon: <Building size={20} /> },
              { size: 'Large (30+)', icon: <Warehouse size={20} /> }
            ].map(({ size, icon }) => (
              <Card 
                key={size} 
                className={`cursor-pointer transition-all hover:border-[#8B5CF6]/70 hover:shadow-sm ${
                  dealershipSize === size ? 'border-[#8B5CF6] bg-[#8B5CF6]/5 shadow-sm' : ''
                }`}
                onClick={() => setDealershipSize(size)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`text-${dealershipSize === size ? '[#8B5CF6]' : 'gray-500'}`}>
                    {icon}
                  </div>
                  <p className="font-medium text-gray-800">{size}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-3">
          <Label>Primary Business Focus</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {['New Vehicles', 'Used Vehicles', 'Both', 'Service & Parts'].map((focus) => (
              <Card key={focus} className="cursor-pointer transition-all hover:border-[#8B5CF6]/70 hover:shadow-sm">
                <CardContent className="p-4 flex items-center justify-center">
                  <p className="font-medium text-center text-gray-800">{focus}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
      
      <motion.div variants={itemVariants} className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
        <Button
          variant="outline"
          onClick={handleBack}
          className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10 w-full sm:w-auto"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        
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

export default Dealership;

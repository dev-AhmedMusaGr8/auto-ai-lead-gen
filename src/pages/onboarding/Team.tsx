
import React from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Plus, User, Users, AlertCircle, ArrowLeft } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const Team = () => {
  const { setCurrentStep, goBack } = useOnboarding();
  const navigate = useNavigate();

  const handleContinue = () => {
    setCurrentStep('complete');
    navigate('/onboarding/complete');
  };

  const handleBack = () => {
    goBack();
    navigate('/onboarding/inventory');
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
          Invite your team
        </h1>
        <p className="text-gray-600">
          Add team members to collaborate with you. They'll receive an email invitation to join your dealership.
        </p>
      </motion.div>
      
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="flex gap-2">
            <Input id="email" placeholder="Enter team member's email" className="flex-1" />
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-800">Invited Team Members</h3>
          </div>
          
          <motion.div
            className="space-y-3 border rounded-lg p-4 bg-white"
            variants={{
              hidden: { opacity: 0, height: 0 },
              visible: { 
                opacity: 1,
                height: 'auto',
                transition: { duration: 0.4, delay: 0.2 }
              }
            }}
          >
            {[
              {
                email: "sales@example.com",
                role: "Sales Team"
              },
              {
                email: "service@example.com",
                role: "Service Department"
              }
            ].map((member, index) => (
              <React.Fragment key={member.email}>
                {index > 0 && <div className="border-t"></div>}
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <User className="h-6 w-6" />
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">{member.email}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  <span className="text-sm px-2 py-1 bg-amber-100 text-amber-700 rounded">Pending</span>
                </div>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg"
      >
        <AlertCircle className="h-5 w-5 text-blue-500" />
        <p className="text-sm text-blue-700">
          You can invite more team members after completing the onboarding process from the Team section.
        </p>
      </motion.div>
      
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

export default Team;

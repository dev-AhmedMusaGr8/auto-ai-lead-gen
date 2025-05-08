
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const HROnboarding = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const completeOnboarding = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role_onboarding_completed: true })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Onboarding completed",
        description: "Welcome to the HR dashboard!"
      });
      
      navigate('/dashboard/hr');
    } catch (error: any) {
      toast({
        title: "Error completing onboarding",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-4">Welcome to HR Portal</h2>
      <p className="text-lg mb-6">Let's get you familiar with the HR tools.</p>
      
      <div className="space-y-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="text-xl font-semibold mb-2">As an HR team member, you'll be able to:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Manage employee records and information</li>
            <li>Handle recruitment and onboarding processes</li>
            <li>Oversee performance evaluations</li>
            <li>Access department-specific analytics</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2">Your HR Dashboard</h3>
          <p className="mb-4">Your personalized dashboard provides quick access to employee data, pending reviews, and HR analytics.</p>
        </div>
      </div>
      
      <Button 
        onClick={completeOnboarding} 
        size="lg"
        className="w-full sm:w-auto"
      >
        Complete Onboarding
      </Button>
    </motion.div>
  );
};

export default HROnboarding;

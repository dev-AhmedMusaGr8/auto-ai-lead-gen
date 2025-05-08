
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const SupportOnboarding = () => {
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
        description: "Welcome to the Support dashboard!"
      });
      
      navigate('/dashboard/support');
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
      <h2 className="text-3xl font-bold mb-4">Welcome to Support Portal</h2>
      <p className="text-lg mb-6">Let's get you familiar with the support tools.</p>
      
      <div className="space-y-6 mb-8">
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
          <h3 className="text-xl font-semibold mb-2">As a Support team member, you'll be able to:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Manage customer support tickets</li>
            <li>Track issue resolution progress</li>
            <li>Communicate with customers</li>
            <li>Access department-specific analytics</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2">Your Support Dashboard</h3>
          <p className="mb-4">Your personalized dashboard provides quick access to support tickets, response metrics, and customer satisfaction data.</p>
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

export default SupportOnboarding;

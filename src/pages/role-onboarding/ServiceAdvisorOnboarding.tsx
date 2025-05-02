
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, Wrench, ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const ServiceAdvisorOnboarding = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleComplete = async () => {
    try {
      await supabase
        .from('profiles')
        .update({ role_onboarding_completed: true })
        .eq('id', profile?.id);
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
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
          Welcome to Your Service Dashboard
        </h1>
        <p className="text-gray-600">
          Let's get you started with everything you need to manage service operations effectively with AI assistance.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6">
        {[
          {
            icon: <Calendar className="w-8 h-8 text-purple-500" />,
            title: "Intelligent Scheduling",
            description: "AI-powered appointment scheduling with optimized time slots"
          },
          {
            icon: <Wrench className="w-8 h-8 text-purple-500" />,
            title: "Service Management",
            description: "Track and manage service tickets with predictive maintenance insights"
          },
          {
            icon: <ClipboardCheck className="w-8 h-8 text-purple-500" />,
            title: "Customer Communication",
            description: "Automated updates and AI-generated service recommendations"
          }
        ].map((feature, index) => (
          <div key={index} className="flex items-start gap-4 p-4 rounded-lg border hover:border-purple-200 transition-colors">
            <div className="p-2 bg-purple-50 rounded-lg">
              {feature.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="pt-6">
        <Button
          onClick={handleComplete}
          className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
        >
          Go to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ServiceAdvisorOnboarding;

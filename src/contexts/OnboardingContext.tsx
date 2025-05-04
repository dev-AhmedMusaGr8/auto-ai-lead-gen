
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

type OnboardingStep = 'welcome' | 'dealership' | 'inventory' | 'team' | 'complete';

interface OnboardingContextType {
  currentStep: OnboardingStep;
  setCurrentStep: (step: OnboardingStep) => void;
  dealershipName: string;
  setDealershipName: (name: string) => void;
  dealershipSize: string;
  setDealershipSize: (size: string) => void;
  completeOnboarding: () => Promise<void>;
  progress: number;
  goBack: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const steps: OnboardingStep[] = ['welcome', 'dealership', 'inventory', 'team', 'complete'];

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [dealershipName, setDealershipName] = useState('');
  const [dealershipSize, setDealershipSize] = useState('');
  const [progress, setProgress] = useState(0);
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Initialize onboarding state based on user's dealership name if available
  useEffect(() => {
    if (profile?.dealership_id) {
      const fetchDealershipInfo = async () => {
        const { data, error } = await supabase
          .from('dealerships')
          .select('name, size')
          .eq('id', profile.dealership_id)
          .single();
          
        if (data && !error) {
          setDealershipName(data.name || '');
          setDealershipSize(data.size || '');
        }
      };
      
      fetchDealershipInfo();
    }
  }, [profile]);

  // Update progress whenever the currentStep changes
  useEffect(() => {
    const stepIndex = steps.indexOf(currentStep);
    const progressPercentage = (stepIndex / (steps.length - 1)) * 100;
    setProgress(progressPercentage);
  }, [currentStep]);

  // Navigate back to the previous step
  const goBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const completeOnboarding = async () => {
    if (!user) {
      console.error("No user found to complete onboarding");
      return;
    }

    try {
      console.log("Starting onboarding completion process");
      
      // First create or update the dealership
      let dealershipId;
      
      if (profile?.dealership_id) {
        // Update existing dealership
        const { error: dealershipError } = await supabase
          .from('dealerships')
          .update({ 
            name: dealershipName,
            size: dealershipSize,
            updated_at: new Date().toISOString() // Convert Date to string
          })
          .eq('id', profile.dealership_id);
          
        if (dealershipError) throw dealershipError;
        dealershipId = profile.dealership_id;
      } else {
        // Create new dealership
        const { data: dealershipData, error: dealershipError } = await supabase
          .from('dealerships')
          .insert({ // Fixed: Use a single object instead of an array for a single insert
            name: dealershipName,
            size: dealershipSize,
            created_at: new Date().toISOString(), // Convert Date to string
            updated_at: new Date().toISOString()  // Convert Date to string
          })
          .select('id')
          .single();
          
        if (dealershipError) throw dealershipError;
        dealershipId = dealershipData.id;
      }
      
      console.log("Dealership created/updated with ID:", dealershipId);
      
      // Update the user profile to mark onboarding as complete
      const { error } = await supabase
        .from('profiles')
        .update({ 
          onboarding_completed: true,
          dealership_id: dealershipId,
          updated_at: new Date().toISOString() // Convert Date to string
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }
      
      console.log("Profile updated, onboarding marked as complete");

      toast({
        title: "Onboarding completed!",
        description: "Your dealership has been set up successfully."
      });

      // Navigate to dashboard after successful onboarding completion
      navigate('/dashboard', { replace: true });

    } catch (error: any) {
      console.error("Failed to complete onboarding:", error);
      toast({
        title: "Error completing onboarding",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  // Provide the actual value to avoid undefined context
  const contextValue: OnboardingContextType = {
    currentStep,
    setCurrentStep,
    dealershipName,
    setDealershipName,
    dealershipSize,
    setDealershipSize,
    completeOnboarding,
    progress,
    goBack,
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

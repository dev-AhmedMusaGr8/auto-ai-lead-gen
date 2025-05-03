
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

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
  const { user } = useAuth();

  useEffect(() => {
    const stepIndex = steps.indexOf(currentStep);
    const progressPercentage = (stepIndex / (steps.length - 1)) * 100;
    setProgress(progressPercentage);
  }, [currentStep]);

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
      // Update the user profile to mark onboarding as complete
      const { error } = await supabase
        .from('profiles')
        .update({ 
          onboarding_completed: true,
          dealership_name: dealershipName,
          dealership_size: dealershipSize
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Onboarding completed!",
        description: "Your dealership has been set up successfully."
      });

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

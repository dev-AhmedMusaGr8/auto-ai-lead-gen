
import React, { createContext, useContext, useState, useEffect } from 'react';

type OnboardingStep = 'welcome' | 'dealership' | 'inventory' | 'team' | 'complete';

interface OnboardingContextType {
  currentStep: OnboardingStep;
  setCurrentStep: (step: OnboardingStep) => void;
  dealershipName: string;
  setDealershipName: (name: string) => void;
  dealershipSize: string;
  setDealershipSize: (size: string) => void;
  completeOnboarding: () => void;
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

  const completeOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    // Additional setup could be done here, like saving to backend
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

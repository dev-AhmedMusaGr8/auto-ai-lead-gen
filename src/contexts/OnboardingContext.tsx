
import React, { createContext, useContext, useState } from 'react';

type OnboardingStep = 'welcome' | 'dealership' | 'inventory' | 'team' | 'complete';

interface OnboardingContextType {
  currentStep: OnboardingStep;
  setCurrentStep: (step: OnboardingStep) => void;
  dealershipName: string;
  setDealershipName: (name: string) => void;
  dealershipSize: string;
  setDealershipSize: (size: string) => void;
  completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [dealershipName, setDealershipName] = useState('');
  const [dealershipSize, setDealershipSize] = useState('');

  const completeOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    // Additional setup could be done here, like saving to backend
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        dealershipName,
        setDealershipName,
        dealershipSize,
        setDealershipSize,
        completeOnboarding,
      }}
    >
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


import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize onboarding state based on user's dealership name if available
  useEffect(() => {
    console.log("OnboardingProvider: Checking profile and dealership_id", profile);
    
    if (!profile) return;
    
    const dealershipId = profile.dealership_id || profile.org_id;
    if (dealershipId) {
      console.log("OnboardingProvider: Fetching dealership info for", dealershipId);
      
      const fetchDealershipInfo = async () => {
        const { data, error } = await supabase
          .from('dealerships')
          .select('name, size')
          .eq('id', dealershipId)
          .single();
          
        if (data && !error) {
          console.log("OnboardingProvider: Dealership data found", data);
          setDealershipName(data.name || '');
          setDealershipSize(data.size || '');
        } else {
          console.error("OnboardingProvider: Error fetching dealership", error);
        }
      };
      
      fetchDealershipInfo();
    } else {
      console.log("OnboardingProvider: No dealership_id found");
    }
  }, [profile]);

  // Update progress whenever the currentStep changes
  useEffect(() => {
    const stepIndex = steps.indexOf(currentStep);
    const progressPercentage = (stepIndex / (steps.length - 1)) * 100;
    setProgress(progressPercentage);
  }, [currentStep]);

  // Check if onboarding is completed and redirect if necessary
  useEffect(() => {
    console.log("OnboardingProvider: Checking if onboarding is completed", profile?.onboarding_completed);
    
    if (profile?.onboarding_completed && currentStep !== 'complete') {
      console.log("OnboardingProvider: Onboarding is completed, redirecting to dashboard");
      navigate('/dashboard/admin', { replace: true });
    }
  }, [profile, navigate, currentStep]);

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
      let dealershipId = profile?.dealership_id || profile?.org_id;
      
      if (dealershipId) {
        // Update existing dealership
        console.log(`Updating existing dealership ${dealershipId}`);
        
        const { error: dealershipError } = await supabase
          .from('dealerships')
          .update({ 
            name: dealershipName,
            size: dealershipSize,
            updated_at: new Date().toISOString()
          })
          .eq('id', dealershipId);
          
        if (dealershipError) {
          console.error("Error updating dealership:", dealershipError);
          console.error("Error details:", JSON.stringify(dealershipError));
          
          // Try using edge function as fallback
          try {
            console.log("Attempting to use edge function to update dealership");
            const { data: funcData, error: funcError } = await supabase.functions.invoke('update-dealership', {
              body: { 
                dealershipId,
                name: dealershipName,
                size: dealershipSize,
                userId: user.id
              }
            });
            
            if (funcError) {
              console.error("Edge function error:", funcError);
              throw dealershipError;
            }
            
            console.log("Dealership updated via edge function:", funcData);
          } catch (edgeFuncError) {
            console.error("Edge function fallback failed:", edgeFuncError);
            throw dealershipError;
          }
        }
      } else {
        // This should rarely happen as the dealership is created during signup
        // But just in case, we'll create it here
        console.log("No dealership ID found. Creating new dealership");
        
        const { data: dealershipData, error: dealershipError } = await supabase
          .from('dealerships')
          .insert({ 
            name: dealershipName,
            size: dealershipSize,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
          
        if (dealershipError) {
          console.error("Error creating dealership:", dealershipError);
          console.error("Error details:", JSON.stringify(dealershipError));
          
          // Try using edge function as fallback
          try {
            console.log("Attempting to use edge function for organization creation");
            const { data: funcData, error: funcError } = await supabase.functions.invoke('create-organization', {
              body: { 
                name: dealershipName,
                userId: user.id
              }
            });
            
            if (funcError) {
              console.error("Edge function error:", funcError);
              throw dealershipError;
            }
            
            if (funcData?.id) {
              console.log("Organization created via edge function:", funcData);
              dealershipId = funcData.id;
            } else {
              throw new Error("No organization ID returned from edge function");
            }
          } catch (edgeFuncError) {
            console.error("Edge function fallback failed:", edgeFuncError);
            throw dealershipError;
          }
        } else {
          dealershipId = dealershipData.id;
        }
        
        console.log("New dealership created with ID:", dealershipId);
      }
      
      // Update the user profile to mark onboarding as complete
      const { error } = await supabase
        .from('profiles')
        .update({ 
          onboarding_completed: true,
          dealership_id: dealershipId,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error("Error updating profile after onboarding:", error);
        console.error("Error details:", JSON.stringify(error));
        
        // Try using edge function as fallback
        try {
          console.log("Attempting to use edge function to update profile");
          const { data: funcData, error: funcError } = await supabase.functions.invoke('update-profile', {
            body: { 
              userId: user.id,
              onboarding_completed: true,
              dealership_id: dealershipId
            }
          });
          
          if (funcError) {
            console.error("Edge function error:", funcError);
            throw error;
          }
          
          console.log("Profile updated via edge function:", funcData);
        } catch (edgeFuncError) {
          console.error("Edge function fallback failed:", edgeFuncError);
          throw error;
        }
      }
      
      console.log("Profile updated, onboarding marked as complete");

      toast({
        title: "Onboarding completed!",
        description: "Your dealership has been set up successfully."
      });

      // Navigate to dashboard after successful onboarding completion
      navigate('/dashboard/admin', { replace: true });

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

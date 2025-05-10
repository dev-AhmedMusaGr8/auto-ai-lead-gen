
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { createOrganization } from "@/contexts/auth/profileUtils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CreateOrganization = () => {
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize page and check if user already has an organization
  useEffect(() => {
    const checkProfile = async () => {
      try {
        console.log("CreateOrganization: Component mounted, initializing");
        
        // If no user yet, show loading state
        if (!user) {
          console.log("CreateOrganization: No user found yet, waiting for auth to complete");
          return;
        }

        console.log("CreateOrganization: User found with ID:", user.id);
        console.log("CreateOrganization: Current profile state:", profile);
        
        // User exists, but we might not have their profile yet
        if (!profile) {
          if (refreshProfile) {
            console.log("CreateOrganization: Profile not loaded yet, refreshing...");
            try {
              const refreshedProfile = await refreshProfile();
              
              console.log("CreateOrganization: Profile after refresh:", refreshedProfile);
              
              // If profile has org_id, redirect appropriately
              if (refreshedProfile?.org_id || refreshedProfile?.dealership_id) {
                console.log("CreateOrganization: User already has an organization, redirecting");
                // Redirect to onboarding or dashboard based on profile state
                if (refreshedProfile.is_admin && !refreshedProfile.onboarding_completed) {
                  navigate('/onboarding/welcome', { replace: true });
                } else {
                  navigate('/dashboard', { replace: true });
                }
              } else {
                // No org_id, show the form
                console.log("CreateOrganization: User has no organization, showing form");
                setInitializing(false);
              }
            } catch (refreshError) {
              console.error("CreateOrganization: Error refreshing profile:", refreshError);
              setInitializing(false);
              setError("Error loading your profile. Please try again or contact support.");
            }
          } else {
            // No refresh function, allow organization creation anyway
            console.log("CreateOrganization: No refreshProfile function available");
            setInitializing(false);
          }
        } else {
          // We already have the profile
          if (profile.org_id || profile.dealership_id) {
            console.log("CreateOrganization: User already has organization with ID:", profile.org_id || profile.dealership_id);
            // Redirect based on profile state
            if (profile.is_admin && !profile.onboarding_completed) {
              navigate('/onboarding/welcome', { replace: true });
            } else {
              navigate('/dashboard', { replace: true });
            }
          } else {
            // No org_id in existing profile, show the form
            console.log("CreateOrganization: User has no organization, showing form");
            setInitializing(false);
          }
        }
      } catch (err) {
        console.error("Error in org page initialization:", err);
        setInitializing(false);
        setError("Error loading your profile. Please refresh the page or contact support.");
      }
    };
    
    checkProfile();
  }, [user, profile, navigate, refreshProfile]);

  // Secondary effect to check whenever the user or profile changes
  useEffect(() => {
    console.log("CreateOrganization: User or profile dependency changed");
    console.log("User:", user);
    console.log("Profile:", profile);
    
    if (initializing && user) {
      console.log("User is available but still initializing, rechecking...");
      const checkProfileAgain = async () => {
        if (!profile && refreshProfile) {
          console.log("No profile yet, trying to refresh again");
          await refreshProfile();
        } else if (profile) {
          console.log("Profile is now available:", profile);
          setInitializing(false);
        }
      };
      
      checkProfileAgain();
    }
  }, [user, profile, refreshProfile, initializing]);

  // Reset error message when organization name changes
  useEffect(() => {
    if (error && orgName) {
      setError(null);
    }
  }, [orgName, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orgName.trim()) {
      setError("Organization name cannot be empty");
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be signed in to create an organization.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Creating organization ${orgName} for user ${user.id}`);
      const orgId = await createOrganization(orgName, user.id);
      
      if (orgId) {
        console.log(`Organization created with ID ${orgId}`);
        toast({
          title: "Organization created",
          description: `Your organization "${orgName}" has been created successfully.`
        });
        
        // Force a refresh of the auth context to get updated profile
        if (refreshProfile) {
          console.log("Refreshing profile after organization creation");
          try {
            const updatedProfile = await refreshProfile();
            
            console.log("Updated profile after refresh:", updatedProfile);
            
            // Navigate to onboarding welcome page with a slight delay to allow state to sync
            setTimeout(() => {
              console.log("Navigating to onboarding welcome page");
              navigate('/onboarding/welcome', { replace: true });
            }, 500);
          } catch (refreshError) {
            console.error("Error refreshing profile after org creation:", refreshError);
            // Navigate anyway even if refresh failed
            navigate('/onboarding/welcome', { replace: true });
          }
        } else {
          // If no refresh function, navigate anyway
          navigate('/onboarding/welcome', { replace: true });
        }
      } else {
        throw new Error("Failed to create organization - no organization ID returned");
      }
    } catch (error: any) {
      console.error("Error creating organization:", error);
      setError(error.message || "An unexpected error occurred while creating your organization");
      toast({
        title: "Error creating organization",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while initializing
  if (initializing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="mt-4 text-gray-600">Loading your account details...</p>
        {/* Display debug info in development */}
        <div className="mt-4 text-xs text-gray-400">
          <p>User ID: {user?.id || 'Not loaded'}</p>
          <p>Auth state: {user ? 'Authenticated' : 'Not authenticated'}</p>
          <p>Profile: {profile ? 'Loaded' : 'Not loaded'}</p>
        </div>
      </div>
    );
  }

  // Show not authenticated message if no user
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>
            You need to be signed in to create an organization. Please sign in or refresh the page.
          </AlertDescription>
        </Alert>
        <Button 
          className="mt-4"
          onClick={() => navigate('/signin', { replace: true })}
        >
          Go to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 text-center">
          <div className="flex justify-center">
            <svg className="h-10 w-10 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="6" fill="#6366F1" />
              <path d="M7.5 7.5H12.5L16.5 12L12.5 16.5H7.5V7.5Z" fill="white" />
            </svg>
            <span className="text-2xl font-bold text-gray-800">AutoCRMAI</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create Your Organization
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Set up your dealership's profile to get started
          </p>
        </div>

        {error && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Alert variant="destructive">
              <AlertTitle>Error creating organization</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <motion.div 
          className="bg-white rounded-lg shadow-lg px-8 py-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                name="orgName"
                type="text"
                required
                className="mt-1"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Your Dealership Name"
                disabled={loading}
              />
            </div>
            <div>
              <Button
                type="submit"
                className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Creating...
                  </>
                ) : (
                  "Create Organization"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CreateOrganization;

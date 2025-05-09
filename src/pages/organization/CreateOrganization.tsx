
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { createOrganization } from "@/contexts/auth/profileUtils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CreateOrganization = () => {
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, profile, session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user already has an organization and redirect accordingly
  useEffect(() => {
    if (profile) {
      if (profile.org_id || profile.dealership_id) {
        console.log("User already has an organization, redirecting");
        
        // If admin onboarding is not completed, redirect to onboarding
        if (profile.is_admin && !profile.onboarding_completed) {
          navigate('/onboarding/welcome', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        console.log("User has no organization, staying on create page");
      }
    }
  }, [profile, navigate]);

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
        
        // Force a reload of the auth context to get updated profile
        if (session) {
          // Wait a bit for the database to update
          setTimeout(() => {
            // Go to onboarding since this is a new org
            navigate('/onboarding/welcome', { replace: true });
          }, 500);
        } else {
          navigate('/signin', { replace: true });
        }
      } else {
        throw new Error("Failed to create organization");
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

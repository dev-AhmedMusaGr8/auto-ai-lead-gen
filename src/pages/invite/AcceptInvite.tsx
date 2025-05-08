
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get('token') || "");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [inviteData, setInviteData] = useState<any>(null);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const { acceptInvite } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        toast({
          title: "Invalid invitation",
          description: "No invitation token provided.",
          variant: "destructive"
        });
        setIsValidatingToken(false);
        return;
      }

      try {
        setIsValidatingToken(true);
        const { data, error } = await supabase.functions.invoke('validate-invite', {
          body: { token }
        });

        if (error || !data) {
          throw new Error(error?.message || "Invalid or expired invitation token");
        }

        setInviteData(data);
      } catch (error: any) {
        toast({
          title: "Invalid invitation",
          description: error.message || "This invitation is invalid or has expired.",
          variant: "destructive"
        });
        navigate('/signin');
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [token, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure both passwords match.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await acceptInvite(token, password, fullName);
      
      if (result.error) {
        throw result.error;
      }
      
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });
      
      // The auth state change will handle redirection
    } catch (error: any) {
      toast({
        title: "Error accepting invitation",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (isValidatingToken) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Validating invitation...</p>
        </div>
      </div>
    );
  }

  if (!inviteData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Invalid Invitation</h2>
          <p className="mb-4">This invitation is invalid or has expired.</p>
          <Button onClick={() => navigate('/signin')}>Go to Sign In</Button>
        </div>
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
            Accept Invitation
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You're invited to join {inviteData.orgName || "an organization"} as a {inviteData.role?.replace('_', ' ')}
          </p>
        </div>

        <motion.div 
          className="bg-white rounded-lg shadow-lg px-8 py-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={inviteData.email || ""}
                disabled
                className="mt-1 bg-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="mt-1"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your Full Name"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </div>
            <div>
              <Button
                type="submit"
                className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Accept Invitation"}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AcceptInvite;

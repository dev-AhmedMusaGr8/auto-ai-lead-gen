
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const SignIn = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Pre-fill the form if email is provided in query params (for invitations)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteEmail = params.get('email');
    const inviteToken = params.get('token');
    
    if (inviteEmail) {
      setEmail(inviteEmail);
      // If they have an invite, they should be registering, not logging in
      setIsLogin(false);
    }
    
    // If there's a token, redirect to the accept invite page
    if (inviteToken) {
      navigate(`/invite/accept?token=${inviteToken}`);
    }
  }, [navigate]);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user && profile) {
      // If no organization, redirect to org creation
      if (!profile.org_id) {
        navigate('/organization/create', { replace: true });
        return;
      }
      
      // Determine where to redirect based on profile
      if (profile.is_admin) {
        // If admin onboarding is not completed, go to onboarding
        if (!profile.onboarding_completed) {
          console.log("Admin redirecting to onboarding");
          navigate('/onboarding/welcome', { replace: true });
        } else {
          navigate('/dashboard/admin', { replace: true });
        }
      } else {
        // For non-admin users, check role-specific onboarding
        if (!profile.role_onboarding_completed) {
          console.log("Non-admin redirecting to role onboarding");
          // Determine role-specific onboarding route
          const roleRoutes: Record<string, string> = {
            'sales': '/role-onboarding/sales',
            'hr': '/role-onboarding/hr',
            'finance': '/role-onboarding/finance',
            'support': '/role-onboarding/support'
          };
          navigate(roleRoutes[profile.roles?.[0] || ''] || '/dashboard', { replace: true });
        } else {
          // Determine role-specific dashboard
          const roleDashboards: Record<string, string> = {
            'sales': '/dashboard/sales',
            'hr': '/dashboard/hr',
            'finance': '/dashboard/finance',
            'support': '/dashboard/support'
          };
          navigate(roleDashboards[profile.roles?.[0] || ''] || '/dashboard', { replace: true });
        }
      }
    }
  }, [user, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        console.log("Attempting to sign in with:", email);
        const result = await signIn(email, password);
        if (result && result.error) {
          console.error("Sign in failed with error:", result.error);
          toast({
            title: "Sign in failed",
            description: result.error.message || "Invalid email or password",
            variant: "destructive"
          });
        }
      } else {
        if (!isLogin && !orgName) {
          toast({
            title: "Organization name required",
            description: "Please enter your organization name to sign up.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        const result = await signUp(email, password, name, orgName);
        if (result && !result.error) {
          if (!result.session) {
            toast({
              title: "Account Created",
              description: "Please check your email to verify your account. Once verified, you can set up your organization.",
            });
            setIsLogin(true);
          }
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication Error",
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
          <a href="/" className="flex justify-center">
            <svg className="h-10 w-10 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="6" fill="#6366F1" />
              <path d="M7.5 7.5H12.5L16.5 12L12.5 16.5H7.5V7.5Z" fill="white" />
            </svg>
            <span className="text-2xl font-bold text-gray-800">AutoCRMAI</span>
          </a>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#8B5CF6] hover:text-[#7C3AED] font-medium"
            >
              {isLogin ? "Register now" : "Sign in"}
            </button>
          </p>
        </div>

        <motion.div 
          className="bg-white rounded-lg shadow-lg px-8 py-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@example.com"
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
              />
            </div>
            {!isLogin && (
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
                  placeholder="Your organization name"
                />
              </div>
            )}
            <div>
              <Button
                type="submit"
                className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                disabled={loading}
              >
                {loading ? "Processing..." : isLogin ? "Sign in" : "Create Account"}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignIn;

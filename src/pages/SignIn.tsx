
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SignIn = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Pre-fill the form if email is provided in query params (for invitations)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteEmail = params.get('email');
    if (inviteEmail) {
      setEmail(inviteEmail);
      // If they have an invite, they should be registering, not logging in
      setIsLogin(false);
    }
  }, []);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user && profile) {
      // Determine where to redirect based on profile
      if (profile.roles?.[0] === 'admin') {
        // If admin onboarding is not completed, go to onboarding
        if (!profile.onboarding_completed) {
          console.log("Admin redirecting to onboarding");
          navigate('/onboarding/welcome', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        // For non-admin users, check role-specific onboarding
        if (!profile.role_onboarding_completed) {
          console.log("Non-admin redirecting to role onboarding");
          // Determine role-specific onboarding route
          const roleRoutes: Record<string, string> = {
            'sales_rep': '/role-onboarding/sales',
            'service_advisor': '/role-onboarding/service',
            'finance_admin': '/role-onboarding/finance',
            'marketing': '/role-onboarding/marketing',
            'manager': '/role-onboarding/manager'
          };
          navigate(roleRoutes[profile.roles[0]] || '/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
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
        const result = await signUp(email, password, name, 'admin');
        if (result && !result.error) {
          if (!result.session) {
            toast({
              title: "Dealership Account Created",
              description: "Please check your email to verify your account. Once verified, you can set up your dealership.",
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
            {isLogin ? "Sign in to your dealership" : "Create your dealership account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Don't have a dealership account?" : "Already have a dealership account?"}{" "}
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
                <Label htmlFor="name">Dealership Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your dealership name"
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Work Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@dealership.com"
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

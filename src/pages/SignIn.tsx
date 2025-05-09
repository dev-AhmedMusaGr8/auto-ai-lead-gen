
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { redirectUserBasedOnProfile } from "@/contexts/auth/routingUtils";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SignIn = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, signUp, user, profile, session } = useAuth();
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
      console.log("User is authenticated. Profile:", profile);
      
      // Check if organization exists
      if (!profile.org_id && !profile.dealership_id) {
        console.log("No organization found, redirecting to org creation");
        navigate('/organization/create', { replace: true });
        return;
      }
      
      // Determine redirection based on profile
      redirectUserBasedOnProfile(profile, true, navigate, window.location.pathname);
    }
  }, [user, profile, navigate]);

  // Reset error when form changes
  useEffect(() => {
    if (errorMessage) {
      setErrorMessage(null);
    }
  }, [email, password, confirmPassword, name, isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    
    try {
      if (isLogin) {
        console.log("Attempting to sign in with:", email);
        const result = await signIn(email, password);
        if (result && result.error) {
          console.error("Sign in failed with error:", result.error);
          setErrorMessage(result.error.message || "Invalid email or password");
          toast({
            title: "Sign in failed",
            description: result.error.message || "Invalid email or password",
            variant: "destructive"
          });
        } else {
          console.log("Sign in successful", result);
        }
      } else {
        // Check if passwords match
        if (password !== confirmPassword) {
          setErrorMessage("Passwords do not match");
          toast({
            title: "Password mismatch",
            description: "The password and confirmation password do not match.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        console.log("Attempting to sign up with:", email, name);
        const result = await signUp(email, password, name);
        
        if (result && !result.error) {
          if (!result.session) {
            toast({
              title: "Account Created",
              description: "Please check your email to verify your account. Once verified, you can set up your organization.",
            });
            setIsLogin(true);
          } else {
            console.log("Sign up successful with session, user ID:", result.user?.id);
            
            // Navigate directly to create organization page
            toast({
              title: "Account Created",
              description: "Your account has been created successfully. Now let's set up your organization.",
            });
            
            navigate('/organization/create', { replace: true });
          }
        } else if (result && result.error) {
          setErrorMessage(result.error.message || "Failed to create account");
          toast({
            title: "Sign up failed",
            description: result.error.message || "Failed to create account",
            variant: "destructive"
          });
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setErrorMessage(error.message || "An unexpected error occurred");
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
        
        {errorMessage && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Alert variant="destructive">
              <AlertTitle>{isLogin ? "Sign in error" : "Sign up error"}</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
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
                  disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
            {!isLogin && (
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
                  disabled={loading}
                />
              </div>
            )}
            <div>
              <Button
                type="submit"
                className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  isLogin ? "Sign in" : "Create Account"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignIn;

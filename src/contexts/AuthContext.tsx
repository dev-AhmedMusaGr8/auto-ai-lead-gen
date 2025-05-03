
import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType, UserProfile, UserRole, AuthResponse } from '@/types/auth';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*, user_roles(role)')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      // Fix the type issue with user_roles
      const userProfile: UserProfile = {
        ...profileData,
        roles: profileData.user_roles && Array.isArray(profileData.user_roles) 
          ? profileData.user_roles.map((r: any) => r.role as UserRole)
          : [] // Default to empty array if user_roles is not an array
      };

      console.log("Fetched user profile:", userProfile);
      return userProfile;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      return null;
    }
  };

  const handleAuthChange = async (event: string, session: any) => {
    console.log("Auth state changed:", event, session?.user?.id);
    setUser(session?.user ?? null);
    
    if (session?.user) {
      const profile = await fetchUserProfile(session.user.id);
      setProfile(profile);
      
      if (profile) {
        if (!profile.onboarding_completed) {
          console.log("Navigating to onboarding welcome");
          navigate('/onboarding/welcome');
        } else if (!profile.role_onboarding_completed) {
          const roleRoute = getRoleOnboardingRoute(profile.roles[0]);
          console.log("Navigating to role onboarding:", roleRoute);
          navigate(roleRoute);
        } else {
          console.log("Navigating to dashboard");
          navigate('/dashboard');
        }
      } else {
        // If we have a session but no profile, go to onboarding
        console.log("No profile found, navigating to onboarding");
        navigate('/onboarding/welcome');
      }
    } else {
      setProfile(null);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // To avoid deadlocks in the auth system, we won't call other Supabase functions
      // or navigate directly inside this callback
      setUser(session?.user ?? null);
      
      // Use setTimeout to defer complex operations outside the immediate callback
      setTimeout(() => {
        if (session?.user) {
          handleAuthChange(event, session);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }, 0);
    });
    
    // Check for existing session on initial load
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Initial session check:", session?.user?.id);
      
      if (session?.user) {
        handleAuthChange('INITIAL_SESSION', session);
      } else {
        setIsLoading(false);
      }
    };

    initializeAuth();
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  const getRoleOnboardingRoute = (role: UserRole): string => {
    const routes: { [key in UserRole]: string } = {
      admin: '/onboarding/welcome',
      sales_rep: '/role-onboarding/sales',
      service_advisor: '/role-onboarding/service',
      finance_admin: '/role-onboarding/finance',
      marketing: '/role-onboarding/marketing',
      manager: '/role-onboarding/manager'
    };
    return routes[role] || '/dashboard';
  };

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      console.log("Attempting sign in for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in to your dealership account.",
      });
      
      return { ...data };
    } catch (error: any) {
      console.error("Sign in error:", error.message);
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: UserRole = 'admin'): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) throw error;
      toast({
        title: "Success",
        description: "Please check your email to verify your account.",
      });
      return { ...data };
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/signin');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const hasRole = (role: UserRole) => {
    return profile?.roles?.includes(role) ?? false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isLoading,
      hasRole,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

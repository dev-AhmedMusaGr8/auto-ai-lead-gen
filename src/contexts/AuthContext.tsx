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

  const redirectUserBasedOnProfile = (profile: UserProfile | null) => {
    if (!profile) {
      console.log("No profile found, navigating to onboarding");
      navigate('/onboarding/welcome');
      return;
    }

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
  };

  const handleAuthChange = async (event: string, session: any) => {
    console.log("Auth state changed:", event, session?.user?.id);
    
    if (session?.user) {
      setUser(session.user);
      const userProfile = await fetchUserProfile(session.user.id);
      setProfile(userProfile);
      
      // Only redirect on certain auth events to avoid navigation loops
      if (['SIGNED_IN', 'TOKEN_REFRESHED', 'INITIAL_SESSION'].includes(event)) {
        redirectUserBasedOnProfile(userProfile);
      }
    } else {
      setUser(null);
      setProfile(null);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // To avoid deadlocks, we use setTimeout to handle complex operations
      setTimeout(() => {
        handleAuthChange(event, session);
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
  }, []);

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

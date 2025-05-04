
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
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
          : ['admin'] // Default to admin if no role is found
      };

      console.log("Fetched user profile:", userProfile);
      return userProfile;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      return null;
    }
  };

  const determineRedirectPath = (profile: UserProfile | null): string => {
    // If no profile found, go to sign in
    if (!profile) {
      return '/signin';
    }

    // If onboarding is not completed, go to onboarding
    if (!profile.onboarding_completed) {
      return '/onboarding/welcome';
    }
    
    // If role onboarding is not completed for non-admin users
    if (!profile.role_onboarding_completed && profile.roles[0] !== 'admin') {
      // Determine which role-specific onboarding to show
      const roleRoutes: Record<UserRole, string> = {
        'admin': '/dashboard',
        'sales_rep': '/role-onboarding/sales',
        'service_advisor': '/role-onboarding/service',
        'finance_admin': '/role-onboarding/finance',
        'marketing': '/role-onboarding/marketing',
        'manager': '/role-onboarding/manager'
      };
      return roleRoutes[profile.roles[0]] || '/dashboard';
    }
    
    // Default to dashboard
    return '/dashboard';
  };

  const redirectUserBasedOnProfile = (profile: UserProfile | null) => {
    const redirectPath = determineRedirectPath(profile);
    
    // Only redirect if we're not already on the correct path
    // This prevents unnecessary navigation loops
    if (!location.pathname.startsWith(redirectPath) && 
        location.pathname !== '/' && 
        location.pathname !== '/signin') {
      console.log(`Redirecting to ${redirectPath} from ${location.pathname}`);
      navigate(redirectPath, { replace: true });
    }
  };

  const handleAuthChange = async (event: string, session: Session | null) => {
    console.log("Auth state changed:", event, session?.user?.id);
    
    try {
      if (session?.user) {
        setUser(session.user);
        setSession(session);
        
        // Fetch user profile on auth changes that matter
        if (['SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED', 'INITIAL_SESSION'].includes(event)) {
          const userProfile = await fetchUserProfile(session.user.id);
          setProfile(userProfile);
          
          // Only redirect on SIGNED_IN or INITIAL_SESSION to prevent redirect loops
          if (['SIGNED_IN', 'INITIAL_SESSION'].includes(event)) {
            // Don't redirect away from the index page or login page
            if (location.pathname !== '/' && location.pathname !== '/signin') {
              redirectUserBasedOnProfile(userProfile);
            }
          }
        }
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
        
        // If signed out, redirect to home page
        if (event === 'SIGNED_OUT') {
          navigate('/', { replace: true });
        }
      }
    } catch (error) {
      console.error("Error in auth state change handler:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, _session) => {
      // To avoid deadlocks, we use setTimeout to handle complex operations
      setTimeout(() => {
        handleAuthChange(_event, _session);
      }, 0);
    });
    
    // Check for existing session on initial load
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session?.user?.id);
        
        if (session?.user) {
          await handleAuthChange('INITIAL_SESSION', session);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsLoading(false);
      }
    };

    initializeAuth();
    
    return () => subscription.unsubscribe();
  }, []);

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
            role: role
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
      navigate('/');
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
      session,
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

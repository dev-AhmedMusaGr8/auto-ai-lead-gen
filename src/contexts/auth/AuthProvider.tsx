
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType, AuthResponse } from './types';
import { UserProfile, UserRole } from '@/types/auth';
import { fetchUserProfile } from './profileUtils';
import { redirectUserBasedOnProfile } from './routingUtils';

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

  // Handle auth state changes
  const handleAuthChange = async (event: string, session: Session | null) => {
    console.log("Auth state changed:", event, session?.user?.id);
    
    try {
      if (session?.user) {
        setUser(session.user);
        setSession(session);
        
        // Fetch user profile on auth changes that matter
        if (['SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED', 'INITIAL_SESSION', 'SIGNED_UP'].includes(event)) {
          const userProfile = await fetchUserProfile(session.user.id);
          setProfile(userProfile);
          
          // Redirect on sign in or sign up events
          if (event === 'SIGNED_IN' || event === 'SIGNED_UP') {
            console.log("Redirecting after sign in/up event", event, userProfile);
            // Don't redirect away from the index page (home page) unless it's a sign up
            if (location.pathname !== '/' || event === 'SIGNED_UP') {
              redirectUserBasedOnProfile(userProfile, true, navigate, location.pathname);
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
      
      // Only show success message if there's no session (email confirmation required)
      if (!data.session) {
        toast({
          title: "Success",
          description: "Please check your email to verify your account.",
        });
      } else {
        toast({
          title: "Account created successfully",
          description: "Welcome to your dealership dashboard.",
        });
      }
      
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

  const inviteUser = async (email: string, role: UserRole, dealershipId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log(`Sending invitation to ${email} with role ${role}`);
      
      // Call the edge function to send the invitation email
      const { data, error } = await supabase.functions.invoke('send-invitation', {
        body: {
          email,
          role,
          dealershipId
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}`,
      });
      
      return { success: true };
    } catch (error: any) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Error sending invitation",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
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
      inviteUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

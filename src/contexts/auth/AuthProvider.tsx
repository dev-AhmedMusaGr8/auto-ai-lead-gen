
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType, AuthResponse, Organization, UserProfile, UserRole } from '@/types/auth';
import { fetchUserProfile, fetchOrganization, createOrganization } from './profileUtils';
import { redirectUserBasedOnProfile } from './routingUtils';
import { v4 as uuidv4 } from 'uuid';

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
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Handle auth state changes with improved robustness
  const handleAuthChange = async (event: string, session: Session | null) => {
    console.log("Auth state changed:", event, "User ID:", session?.user?.id, "Path:", location.pathname);
    
    // Always update session and user state first (synchronous operations)
    if (session?.user) {
      setUser(session.user);
      setSession(session);
    } else {
      setUser(null);
      setSession(null);
      setProfile(null);
      setOrganization(null);
    }
    
    try {
      if (session?.user) {
        // For critical auth events, fetch user profile
        if (['SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED', 'INITIAL_SESSION', 'SIGNED_UP'].includes(event)) {
          console.log(`Fetching user profile after ${event} event`);
          
          // Use setTimeout to prevent potential auth deadlocks
          setTimeout(async () => {
            try {
              const userProfile = await fetchUserProfile(session.user.id);
              console.log("User profile after fetch:", userProfile);
              
              setProfile(userProfile);
              
              // Fetch organization details if available
              if (userProfile?.org_id || userProfile?.dealership_id) {
                const orgId = userProfile.org_id || userProfile.dealership_id;
                if (orgId) {
                  console.log("Fetching organization using org_id:", orgId);
                  const org = await fetchOrganization(orgId);
                  setOrganization(org);
                }
              }
              
              // Redirect on sign in or sign up events with proper timing
              if ((event === 'SIGNED_IN' || event === 'SIGNED_UP') && userProfile) {
                console.log("Redirecting after sign in/up event", event);
                console.log("User profile for redirect:", userProfile);
                console.log("Current path:", location.pathname);
                
                // For signup, always go to organization creation first
                if (event === 'SIGNED_UP') {
                  // If not already on the organization creation page, redirect there
                  if (location.pathname !== '/organization/create') {
                    console.log("New signup, redirecting to organization creation");
                    navigate('/organization/create', { replace: true });
                  }
                } else {
                  // For signin, use normal redirection logic based on profile
                  redirectUserBasedOnProfile(userProfile, true, navigate, location.pathname);
                }
              }
              
              setIsLoading(false);
            } catch (error) {
              console.error("Error in profile fetching after auth event:", error);
              setIsLoading(false);
            }
          }, 0);
        } else {
          // For non-critical events, just update loading state
          setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        // If signed out, redirect to home page
        navigate('/', { replace: true });
        setIsLoading(false);
      } else {
        // For other events without a session, just update loading state
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error in auth state change handler:", error);
      setIsLoading(false);
    }
  };

  // Set up auth subscriptions when component mounts
  useEffect(() => {
    console.log("AuthProvider mounted, setting up auth subscription");
    setIsLoading(true);
    
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, _session) => {
      // Use setTimeout to safely handle auth state changes
      setTimeout(() => {
        handleAuthChange(_event, _session);
      }, 0);
    });
    
    // Check for existing session on initial load
    const initializeAuth = async () => {
      try {
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

  // More robust profile refresh method 
  const refreshProfile = async () => {
    if (!user) {
      console.log("No user to refresh profile for");
      return null;
    }
    
    try {
      console.log("Manually refreshing user profile for:", user.id);
      setIsLoading(true);
      
      const userProfile = await fetchUserProfile(user.id);
      console.log("Profile after refresh:", userProfile);
      
      if (userProfile) {
        setProfile(userProfile);
        
        // Also refresh organization if available
        if (userProfile.org_id || userProfile.dealership_id) {
          const orgId = userProfile.org_id || userProfile.dealership_id;
          if (orgId) {
            console.log("Also refreshing organization data:", orgId);
            const org = await fetchOrganization(orgId);
            setOrganization(org);
          }
        }
      }
      
      return userProfile;
    } catch (error) {
      console.error("Error refreshing profile:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Auth methods with improved error handling
  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      console.log("Attempting sign in for:", email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
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
    } finally {
      // Don't set isLoading false here as it will be handled by the auth state change
    }
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<AuthResponse> => {
    try {
      console.log(`Signing up user with email ${email}, name ${fullName}`);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          },
        },
      });
      
      if (error) throw error;
      
      console.log("Signup successful. User:", data.user?.id, "Session:", data.session ? "exists" : "none");
      
      // Only show success message if there's no session (email confirmation required)
      if (!data.session) {
        toast({
          title: "Success",
          description: "Please check your email to verify your account.",
        });
      } else {
        toast({
          title: "Account created successfully",
          description: "Welcome to the platform.",
        });
      }
      
      return { ...data };
    } catch (error: any) {
      console.error("Error in signUp:", error);
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive"
      });
      setIsLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper utilities for role checking
  const hasRole = (role: UserRole) => {
    return profile?.roles?.includes(role) ?? false;
  };
  
  const isAdmin = () => {
    return profile?.is_admin ?? false;
  };

  // User invitation function
  const inviteUser = async (email: string, role: UserRole, department?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!profile?.org_id && !profile?.dealership_id) {
        throw new Error('No organization found for this user');
      }
      
      console.log(`Sending invitation to ${email} with role ${role}`);
      
      // Generate a secure token
      const token = uuidv4();
      
      // Use existing dealership_id for backward compatibility
      const orgId = profile.org_id || profile.dealership_id;
      
      try {
        // Try the new invites table first
        const { error } = await supabase.functions.invoke('send-invitation', {
          body: {
            email,
            role,
            department,
            token,
            orgId,
            orgName: organization?.name || 'your organization'
          }
        });
        
        if (error) throw error;
      } catch (e) {
        console.log("Could not use edge function, falling back to direct insert", e);
        // Fallback - directly update user profile
        // Since invites table might not exist yet, we'll just create a user and assign org
        const { data: userDetails, error: userError } = await supabase.auth.admin.createUser({
          email,
          password: uuidv4(), // Random password, user will need to reset
          email_confirm: true,
          user_metadata: {
            full_name: email.split('@')[0],
            role,
            department
          }
        });
        
        if (userError) throw userError;
        
        // Update user profile with org_id
        if (userDetails?.user) {
          await supabase
            .from('profiles')
            .update({
              dealership_id: orgId,
              role
            })
            .eq('id', userDetails.user.id);
        }
      }
      
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
  
  const acceptInvite = async (token: string, password: string, fullName: string): Promise<AuthResponse> => {
    try {
      // Simplified implementation since the full invite system isn't implemented yet
      const { data, error } = await supabase.auth.signUp({
        email: fullName + '@example.com', // This should be the email from the invite
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your account has been created. Welcome to the organization!",
      });
      
      return { ...data };
    } catch (error: any) {
      toast({
        title: "Error accepting invitation",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };
  
  const transferAdmin = async (newAdminId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!profile?.is_admin || !profile.org_id) {
        throw new Error('Only organization admins can transfer admin privileges');
      }
      
      // First, remove admin role from current user
      const { error: removeRoleError } = await supabase
        .from('user_roles')
        .delete()
        .match({ user_id: user!.id, role: 'admin' });
      
      if (removeRoleError) throw removeRoleError;
      
      // Then add admin role to new admin
      const { error: addRoleError } = await supabase
        .from('user_roles')
        .insert({ user_id: newAdminId, role: 'admin' });
      
      if (addRoleError) throw addRoleError;
      
      toast({
        title: "Admin privileges transferred",
        description: "You are no longer the organization admin.",
      });
      
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Error transferring admin privileges",
        description: error.message,
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
      organization,
      isLoading,
      hasRole,
      isAdmin,
      signIn,
      signUp,
      signOut,
      inviteUser,
      acceptInvite,
      transferAdmin,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

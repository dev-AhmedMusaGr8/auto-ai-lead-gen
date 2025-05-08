
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
          
          // Fetch organization details if available
          if (userProfile?.org_id) {
            const org = await fetchOrganization(userProfile.org_id);
            setOrganization(org);
          }
          
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
        setOrganization(null);
        
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
    }
  };

  const signUp = async (email: string, password: string, fullName: string, orgName?: string): Promise<AuthResponse> => {
    try {
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
      
      if (data.session && orgName) {
        // Create organization for the new user
        await createOrganization(orgName, data.user!.id);
      }
      
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
  
  const isAdmin = () => {
    return profile?.is_admin ?? false;
  };

  const inviteUser = async (email: string, role: UserRole, department?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!profile?.org_id) {
        throw new Error('No organization found for this user');
      }
      
      console.log(`Sending invitation to ${email} with role ${role}`);
      
      // Generate a secure token
      const token = uuidv4();
      
      // Insert the invitation into the invites table
      const { error } = await supabase
        .from('invites')
        .insert({
          org_id: profile.org_id,
          email,
          role,
          department,
          token
        });
      
      if (error) throw error;
      
      // Call the edge function to send the invitation email
      const { data, error: fnError } = await supabase.functions.invoke('send-invitation', {
        body: {
          email,
          role,
          token,
          orgId: profile.org_id,
          orgName: organization?.name || 'your organization'
        }
      });
      
      if (fnError) throw fnError;
      
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
      // First validate the invite token
      const { data: inviteData, error: fnError } = await supabase.functions.invoke('validate-invite', {
        body: { token }
      });
      
      if (fnError) throw fnError;
      if (!inviteData || !inviteData.email) throw new Error('Invalid invitation token');
      
      // Sign up the user with the email from the invitation
      const { data, error } = await supabase.auth.signUp({
        email: inviteData.email,
        password,
        options: {
          data: {
            full_name: fullName,
            org_id: inviteData.org_id,
            role: inviteData.role,
            department: inviteData.department
          }
        }
      });
      
      if (error) throw error;
      
      // Mark the invite as used
      await supabase.functions.invoke('mark-invite-used', {
        body: { token }
      });
      
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
      
      const { error } = await supabase.rpc('transfer_admin', {
        org_uuid: profile.org_id,
        old_admin_uuid: user!.id,
        new_admin_uuid: newAdminId
      });
      
      if (error) throw error;
      
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
      transferAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

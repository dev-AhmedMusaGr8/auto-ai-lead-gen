import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
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
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*, user_roles(role)')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      const userProfile: UserProfile = {
        ...profileData,
        roles: profileData.user_roles.map((r: any) => r.role as UserRole)
      };

      return userProfile;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      return null;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setProfile(profile);
        
        if (profile) {
          if (!profile.onboarding_completed) {
            navigate('/onboarding/welcome');
          } else if (!profile.role_onboarding_completed) {
            const roleRoute = getRoleOnboardingRoute(profile.roles[0]);
            navigate(roleRoute);
          } else {
            navigate('/dashboard');
          }
        }
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id).then(setProfile);
      }
      setIsLoading(false);
    });

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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        if (profile) {
          setProfile(profile);
          navigate(profile.dealership_id ? '/dashboard' : '/onboarding/welcome');
        }
      }

      return { ...data };
    } catch (error: any) {
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

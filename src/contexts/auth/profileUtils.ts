
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/auth';

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
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

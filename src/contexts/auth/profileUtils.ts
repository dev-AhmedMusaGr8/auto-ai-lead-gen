
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole, Organization } from '@/types/auth';

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
        : profileData.role ? [profileData.role as UserRole] : ['admin'] // Use role from profile or default
    };

    console.log("Fetched user profile:", userProfile);
    return userProfile;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
};

export const fetchOrganization = async (orgId: string): Promise<Organization | null> => {
  try {
    console.log("Fetching organization:", orgId);
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single();

    if (error) {
      console.error('Error fetching organization:', error);
      return null;
    }

    return data as Organization;
  } catch (error) {
    console.error("Failed to fetch organization:", error);
    return null;
  }
};

// Function to create a new organization during signup
export const createOrganization = async (name: string, userId: string): Promise<string | null> => {
  try {
    // Create the organization
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert({ name })
      .select('id')
      .single();

    if (orgError) {
      console.error('Error creating organization:', orgError);
      return null;
    }

    // Update the user's profile with the org ID and make them an admin
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        org_id: orgData.id,
        is_admin: true,
        role: 'org_admin'
      })
      .eq('id', userId);

    if (profileError) {
      console.error('Error updating profile with org ID:', profileError);
      return null;
    }

    return orgData.id;
  } catch (error) {
    console.error("Failed to create organization:", error);
    return null;
  }
};

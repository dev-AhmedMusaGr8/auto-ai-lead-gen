
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

    // Get user roles from user_roles table
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (rolesError) {
      console.error('Error fetching user roles:', rolesError);
    }

    // Map the profile data to our UserProfile interface
    const userProfile: UserProfile = {
      id: profileData.id,
      email: profileData.email,
      full_name: profileData.full_name,
      avatar_url: profileData.avatar_url,
      dealership_id: profileData.dealership_id,
      org_id: profileData.dealership_id, // Use dealership_id as org_id for compatibility
      department: null, // Default to null as it's not in the actual table
      is_admin: false, // Default to false, we'll update based on roles
      onboarding_completed: profileData.onboarding_completed,
      role_onboarding_completed: profileData.role_onboarding_completed,
      created_at: profileData.created_at,
      updated_at: profileData.updated_at,
      roles: userRoles ? userRoles.map((r: any) => r.role as UserRole) : ['admin'] // Default to admin if no roles
    };
    
    // Set is_admin based on roles
    userProfile.is_admin = userProfile.roles.includes('admin');

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
      .from('dealerships')
      .select('*')
      .eq('id', orgId)
      .single();
    
    if (error) {
      console.error('Error fetching organization/dealership:', error);
      return null;
    }

    // Map to Organization format
    return {
      id: data.id,
      name: data.name,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error("Failed to fetch organization:", error);
    return null;
  }
};

// Function to create a new organization during signup
export const createOrganization = async (name: string, userId: string): Promise<string | null> => {
  try {
    // Create the organization in dealerships table
    const { data: orgData, error: orgError } = await supabase
      .from('dealerships')
      .insert({ name })
      .select('id')
      .single();

    if (orgError) {
      console.error('Error creating organization:', orgError);
      return null;
    }

    // Update the user's profile with the dealership_id
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ dealership_id: orgData.id })
      .eq('id', userId);

    if (profileError) {
      console.error('Error updating profile with org ID:', profileError);
      return null;
    }

    // Add admin role to user_roles table
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: 'admin' });

    if (roleError) {
      console.error('Error adding admin role:', roleError);
    }

    return orgData.id;
  } catch (error) {
    console.error("Failed to create organization:", error);
    return null;
  }
};

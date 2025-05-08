
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

    // Map the profile data to our UserProfile interface
    const userProfile: UserProfile = {
      id: profileData.id,
      email: profileData.email,
      full_name: profileData.full_name,
      avatar_url: profileData.avatar_url,
      dealership_id: profileData.dealership_id, // Keep for backward compatibility
      org_id: profileData.org_id || profileData.dealership_id, // Use org_id or fallback to dealership_id
      department: profileData.department,
      is_admin: profileData.is_admin || false,
      onboarding_completed: profileData.onboarding_completed || false,
      role_onboarding_completed: profileData.role_onboarding_completed || false,
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
    
    // First try to fetch from organizations table (new schema)
    let { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single();
    
    if (error || !data) {
      console.log("Organization not found in new table, trying dealerships table");
      // Fallback to dealerships table (old schema)
      const { data: dealershipData, error: dealershipError } = await supabase
        .from('dealerships')
        .select('*')
        .eq('id', orgId)
        .single();
      
      if (dealershipError) {
        console.error('Error fetching organization/dealership:', dealershipError);
        return null;
      }
      
      // Map dealership data to organization format
      data = {
        id: dealershipData.id,
        name: dealershipData.name,
        created_at: dealershipData.created_at,
        updated_at: dealershipData.updated_at
      };
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


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
      department: profileData.department || null,
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
      .from('dealerships') // Use dealerships for backward compatibility
      .select('*')
      .eq('id', orgId)
      .single();
    
    if (error || !data) {
      console.log("Organization not found in dealerships table, checking organizations table");
      // Try organizations table
      const { data: orgData, error: orgError } = await supabase
        .from('dealerships') // Fallback to dealerships since organizations may not exist yet
        .select('*')
        .eq('id', orgId)
        .single();
      
      if (orgError) {
        console.error('Error fetching organization/dealership:', orgError);
        return null;
      }
      
      data = orgData;
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
    // Create the organization in dealerships table for now
    // When we fully migrate to organizations table, we can update this
    const { data: orgData, error: orgError } = await supabase
      .from('dealerships')
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
        dealership_id: orgData.id, // Use dealership_id for backward compatibility
        is_admin: true,
        role: 'admin' // Use 'admin' role for backward compatibility
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

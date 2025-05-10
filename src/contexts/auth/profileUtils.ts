
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole, Organization } from '@/types/auth';

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log("Fetching profile for user:", userId);
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return null;
    }

    console.log("Raw profile data:", profileData);

    // Get user roles from user_roles table
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (rolesError) {
      console.error('Error fetching user roles:', rolesError);
    }

    console.log("User roles data:", userRoles);

    const roles = userRoles ? userRoles.map((r: any) => r.role as UserRole) : [];
    const isAdmin = roles.includes('admin') || roles.includes('org_admin');

    // Map the profile data to our UserProfile interface
    const userProfile: UserProfile = {
      id: profileData.id,
      email: profileData.email,
      full_name: profileData.full_name,
      avatar_url: profileData.avatar_url,
      dealership_id: profileData.dealership_id,
      org_id: profileData.dealership_id, // Use dealership_id as org_id for compatibility
      department: null, // Default to null as it's not in the actual table
      is_admin: isAdmin, // Set based on roles
      onboarding_completed: profileData.onboarding_completed || false,
      role_onboarding_completed: profileData.role_onboarding_completed || false,
      created_at: profileData.created_at,
      updated_at: profileData.updated_at,
      roles: roles
    };
    
    console.log("Processed user profile:", userProfile);
    return userProfile;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
};

export const fetchOrganization = async (orgId: string): Promise<Organization | null> => {
  try {
    console.log("Fetching organization:", orgId);
    
    if (!orgId) {
      console.log("No organization ID provided");
      return null;
    }
    
    const { data, error } = await supabase
      .from('dealerships')
      .select('*')
      .eq('id', orgId)
      .single();
    
    if (error) {
      console.error('Error fetching organization/dealership:', error);
      return null;
    }

    console.log("Organization data:", data);

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

// Improved organization creation with better error handling and retries
export const createOrganization = async (name: string, userId: string): Promise<string | null> => {
  try {
    console.log(`Creating organization "${name}" for user ${userId}`);
    
    // First attempt: Use the edge function for organization creation
    try {
      console.log("Attempting to use edge function for organization creation");
      const { data: funcData, error: funcError } = await supabase.functions.invoke('create-organization', {
        body: { name, userId }
      });
      
      if (funcError) {
        console.error('Edge function error:', funcError);
        throw funcError;
      }
      
      if (funcData?.id) {
        console.log("Organization created via edge function:", funcData);
        
        // Update the user's profile with the dealership_id
        const updateResult = await updateProfileWithOrgId(userId, funcData.id);
        
        if (!updateResult.success) {
          console.warn("Could not update profile with organization ID, but organization was created");
        }
        
        // Add admin role if not exists
        await ensureUserHasAdminRole(userId);
        
        return funcData.id;
      } else {
        throw new Error("Edge function returned no organization ID");
      }
    } catch (funcErr) {
      console.error('Error with edge function:', funcErr);
      
      // Second attempt: Direct database operation as a fallback
      return await createOrganizationDirectly(name, userId);
    }
  } catch (error) {
    console.error("Failed to create organization:", error);
    throw error;
  }
};

// Helper function for direct database organization creation
const createOrganizationDirectly = async (name: string, userId: string): Promise<string | null> => {
  try {
    console.log("Creating organization directly in database");
      
    const { data: orgData, error: orgError } = await supabase
      .from('dealerships')
      .insert({
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
      
    if (orgError) {
      console.error('Error creating organization directly:', orgError);
      throw orgError;
    }
    
    console.log("Organization created directly:", orgData);
    
    // Update the user's profile with the dealership_id
    const updateResult = await updateProfileWithOrgId(userId, orgData.id);
    
    if (!updateResult.success) {
      console.warn("Could not update profile with organization ID, but organization was created");
    }
    
    // Add admin role if not exists
    await ensureUserHasAdminRole(userId);
    
    return orgData.id;
  } catch (error) {
    console.error("Failed in direct organization creation:", error);
    throw error;
  }
};

// Helper function to update profile with organization ID
const updateProfileWithOrgId = async (userId: string, orgId: string): Promise<{success: boolean; error?: any}> => {
  try {
    // First try direct update
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        dealership_id: orgId,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (profileError) {
      console.error('Error updating profile with org ID:', profileError);
      
      // Try the update-profile edge function as fallback
      try {
        console.log("Attempting to update profile via edge function");
        const { data: updateData, error: updateError } = await supabase.functions.invoke('update-profile', {
          body: { 
            userId: userId,
            dealership_id: orgId
          }
        });
        
        if (updateError) {
          console.error('Error with update-profile edge function:', updateError);
          return { success: false, error: updateError };
        } else {
          console.log('Profile updated via edge function:', updateData);
          return { success: true };
        }
      } catch (updateErr) {
        console.error("Error calling update-profile function:", updateErr);
        return { success: false, error: updateErr };
      }
    }
    
    console.log(`Successfully updated user profile with dealership_id ${orgId}`);
    return { success: true };
  } catch (error) {
    console.error("Error in updateProfileWithOrgId:", error);
    return { success: false, error };
  }
};

// Helper function to ensure user has admin role
const ensureUserHasAdminRole = async (userId: string): Promise<{success: boolean; error?: any}> => {
  try {
    // Check if user already has the admin role
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin');

    // Add admin role to user_roles table if not exists
    if (!existingRole || existingRole.length === 0) {
      console.log("Adding admin role to user");
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' });

      if (roleError) {
        console.error('Error adding admin role:', roleError);
        return { success: false, error: roleError };
      } else {
        console.log(`Added admin role for user ${userId}`);
        return { success: true };
      }
    } else {
      console.log(`User ${userId} already has admin role`);
      return { success: true };
    }
  } catch (error) {
    console.error("Error in ensureUserHasAdminRole:", error);
    return { success: false, error };
  }
};

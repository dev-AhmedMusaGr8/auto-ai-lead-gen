
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
      onboarding_completed: profileData.onboarding_completed,
      role_onboarding_completed: profileData.role_onboarding_completed,
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

    // Map to Organization format - remove plan property as it doesn't exist in database
    return {
      id: data.id,
      name: data.name,
      // The plan field isn't in the database schema, so we won't include it
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
    console.log(`Creating organization "${name}" for user ${userId}`);
    
    // First check if there is row-level security preventing the insert
    // Removed the rpc call to "get_service_role" as it's not defined in TypeScript types
    // and use the edge function approach directly
    try {
      console.log("Attempting to use edge function for organization creation");
      const { data: funcData, error: funcError } = await supabase.functions.invoke('create-organization', {
        body: { name, userId }
      });
      
      if (funcError) {
        console.error('Edge function error:', funcError);
        return null;
      }
      
      if (funcData?.id) {
        console.log("Organization created via edge function:", funcData);
        
        // Update the user's profile with the dealership_id
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            dealership_id: funcData.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (profileError) {
          console.error('Error updating profile with org ID after edge function:', profileError);
          
          // Try the update-profile edge function if direct update fails
          const { data: updateData, error: updateError } = await supabase.functions.invoke('update-profile', {
            body: { 
              userId: userId,
              dealership_id: funcData.id
            }
          });
          
          if (updateError) {
            console.error('Error with update-profile edge function:', updateError);
          } else {
            console.log('Profile updated via edge function:', updateData);
          }
        }
        
        // Check if user already has the admin role
        const { data: existingRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'admin');

        // Add admin role to user_roles table if not exists
        if (!existingRole || existingRole.length === 0) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({ user_id: userId, role: 'admin' });

          if (roleError) {
            console.error('Error adding admin role:', roleError);
          } else {
            console.log(`Added admin role for user ${userId}`);
          }
        } else {
          console.log(`User ${userId} already has admin role`);
        }
        
        return funcData.id;
      }
    } catch (funcErr) {
      console.error('Error with edge function:', funcErr);
    }
    
    // If we get here, edge function failed or returned no data
    console.error("Failed to create organization via edge function");
    return null;
  } catch (error) {
    console.error("Failed to create organization:", error);
    return null;
  }
};

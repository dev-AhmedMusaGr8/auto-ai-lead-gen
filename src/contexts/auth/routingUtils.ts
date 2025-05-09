
import { UserProfile, UserRole } from '@/types/auth';

export const determineRedirectPath = (profile: UserProfile | null, isNewSession: boolean = false): string => {
  // If no profile found, go to sign in
  if (!profile) {
    console.log("No profile found, redirecting to signin");
    return '/signin';
  }

  console.log("Determining redirect path for profile:", profile);
  
  // For new sessions (like after sign-in), we need to check onboarding status
  if (isNewSession) {
    console.log("Determining redirect for new session");
    
    // If organization is not set, redirect to org creation
    if (!profile.org_id && !profile.dealership_id) {
      console.log("No organization found, redirecting to create organization");
      return '/organization/create';
    }
    
    // If user is an admin and onboarding is not completed
    if (profile.is_admin && profile.onboarding_completed === false) {
      console.log("Admin needs onboarding, redirecting to welcome");
      return '/onboarding/welcome';
    }
    
    // If role onboarding is not completed for non-admin users
    if (!profile.is_admin && profile.role_onboarding_completed === false) {
      console.log("Non-admin needs role onboarding");
      // Determine which role-specific onboarding to show
      const roleRoutes: Record<UserRole, string> = {
        'org_admin': '/role-onboarding/admin',
        'admin': '/role-onboarding/admin',
        'sales': '/role-onboarding/sales',
        'hr': '/role-onboarding/hr',
        'finance': '/role-onboarding/finance',
        'support': '/role-onboarding/support',
        'sales_rep': '/role-onboarding/sales',
        'service_advisor': '/role-onboarding/service',
        'finance_admin': '/role-onboarding/finance',
        'marketing': '/role-onboarding/marketing',
        'manager': '/role-onboarding/admin'
      };
      
      const redirectPath = roleRoutes[profile.roles?.[0] || 'admin'] || '/dashboard';
      console.log("Role onboarding redirect path:", redirectPath);
      return redirectPath;
    }
  }
  
  // For all cases where onboarding is complete or it's not a new session
  if (profile.is_admin) {
    console.log("Redirecting to admin dashboard");
    return '/dashboard/admin';
  } else if (profile.roles?.[0]) {
    const roleDashboards: Record<UserRole, string> = {
      'org_admin': '/dashboard/admin',
      'admin': '/dashboard/admin',
      'sales': '/dashboard/sales',
      'hr': '/dashboard/hr',
      'finance': '/dashboard/finance',
      'support': '/dashboard/support',
      'sales_rep': '/dashboard/sales',
      'service_advisor': '/dashboard/service',
      'finance_admin': '/dashboard/finance',
      'marketing': '/dashboard/marketing',
      'manager': '/dashboard/admin'
    };
    
    const redirectPath = roleDashboards[profile.roles[0]] || '/dashboard';
    console.log("Role dashboard redirect path:", redirectPath);
    return redirectPath;
  }
  
  console.log("Returning default dashboard as redirect path");
  return '/dashboard';
};

export const redirectUserBasedOnProfile = (
  profile: UserProfile | null, 
  isNewSession: boolean = false,
  navigate: (path: string, options?: {replace?: boolean}) => void,
  currentPath: string
) => {
  if (!profile) {
    console.log("No profile to redirect");
    return;
  }
  
  const redirectPath = determineRedirectPath(profile, isNewSession);
  console.log("Redirect path determined:", redirectPath, "current path:", currentPath);
  
  // Paths that should never be redirected from
  const safePublicPaths = ['/', '/signin', '/signup', '/invite/accept'];
  
  // Only redirect if:
  // 1. We're not already on the target path
  // 2. We're not on a safe public path like home or login
  // 3. We're not already in an onboarding flow when we should be
  if (!currentPath.startsWith(redirectPath) && 
      !safePublicPaths.includes(currentPath) &&
      !(currentPath.includes('/onboarding') && redirectPath.includes('/onboarding')) &&
      !(currentPath.includes('/role-onboarding') && redirectPath.includes('/role-onboarding')) &&
      !(currentPath === '/organization/create' && redirectPath === '/onboarding/welcome')) {
    console.log(`Redirecting to ${redirectPath} from ${currentPath}`);
    navigate(redirectPath, { replace: true });
  } else {
    console.log(`Not redirecting, staying on ${currentPath}`);
  }
};

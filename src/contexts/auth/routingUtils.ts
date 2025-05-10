
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
  
  // Don't redirect if already on the target path or a sub-path
  if (currentPath === redirectPath || 
      (redirectPath !== '/dashboard' && currentPath.startsWith(redirectPath))) {
    console.log(`Already at ${currentPath}, which matches redirect path ${redirectPath}`);
    return;
  }
  
  // Paths that should never be redirected from
  const safePublicPaths = ['/', '/signin', '/signup', '/invite/accept'];
  if (safePublicPaths.includes(currentPath)) {
    console.log(`On safe public path ${currentPath}, not redirecting`);
    return;
  }
  
  // Don't redirect if in the correct section already
  const onboardingPaths = ['/onboarding', '/role-onboarding'];
  if (redirectPath.includes('/onboarding') && 
      onboardingPaths.some(p => currentPath.startsWith(p))) {
    console.log(`Already in onboarding flow at ${currentPath}, not redirecting to ${redirectPath}`);
    return;
  }
  
  // Don't redirect if already in the dashboard section when should be in dashboard
  if (redirectPath.includes('/dashboard') && currentPath.includes('/dashboard')) {
    console.log(`Already in dashboard section at ${currentPath}, not redirecting to ${redirectPath}`);
    return;
  }
  
  // Special cases for organization creation
  if (currentPath === '/organization/create') {
    if (!profile.org_id && !profile.dealership_id) {
      console.log(`Staying on organization creation page as user has no organization`);
      return;
    }
    
    if (redirectPath === '/onboarding/welcome') {
      console.log(`Organization creation successful, redirecting to onboarding`);
      navigate(redirectPath, { replace: true });
      return;
    }
  }

  // If we got here, we should redirect
  console.log(`Redirecting to ${redirectPath} from ${currentPath}`);
  navigate(redirectPath, { replace: true });
};

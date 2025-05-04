
import { UserProfile, UserRole } from '@/types/auth';

export const determineRedirectPath = (profile: UserProfile | null, isNewSession: boolean = false): string => {
  // If no profile found, go to sign in
  if (!profile) {
    return '/signin';
  }

  // For new sessions (like after sign-in), we need to check onboarding status
  if (isNewSession) {
    // If onboarding is not completed for admin, go to onboarding
    if (!profile.onboarding_completed && profile.roles?.[0] === 'admin') {
      return '/onboarding/welcome';
    }
    
    // If role onboarding is not completed for non-admin users
    if (!profile.role_onboarding_completed && profile.roles?.[0] !== 'admin') {
      // Determine which role-specific onboarding to show
      const roleRoutes: Record<UserRole, string> = {
        'admin': '/dashboard',
        'sales_rep': '/role-onboarding/sales',
        'service_advisor': '/role-onboarding/service',
        'finance_admin': '/role-onboarding/finance',
        'marketing': '/role-onboarding/marketing',
        'manager': '/role-onboarding/manager'
      };
      return roleRoutes[profile.roles[0]] || '/dashboard';
    }
  }
  
  // For all cases where onboarding is complete or it's not a new session
  return '/dashboard';
};

export const redirectUserBasedOnProfile = (
  profile: UserProfile | null, 
  isNewSession: boolean = false,
  navigate: (path: string, options?: {replace?: boolean}) => void,
  currentPath: string
) => {
  if (!profile) return;
  
  const redirectPath = determineRedirectPath(profile, isNewSession);
  
  // Paths that should never be redirected from
  const safePublicPaths = ['/', '/signin'];
  
  // Only redirect if:
  // 1. We're not already on the target path
  // 2. We're not on a safe public path like home or login
  // 3. We're not already in an onboarding flow when we should be
  if (!currentPath.startsWith(redirectPath) && 
      !safePublicPaths.includes(currentPath) &&
      !(currentPath.includes('/onboarding') && redirectPath.includes('/onboarding')) &&
      !(currentPath.includes('/role-onboarding') && redirectPath.includes('/role-onboarding'))) {
    console.log(`Redirecting to ${redirectPath} from ${currentPath}`);
    navigate(redirectPath, { replace: true });
  }
};

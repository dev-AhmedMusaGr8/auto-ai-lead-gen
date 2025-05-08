
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'org_admin' | 'sales' | 'finance' | 'support' | 'admin' | 'hr';

export interface Organization {
  id: string;
  name: string;
  plan?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  dealership_id: string | null; // Keep for backward compatibility
  org_id: string | null;
  roles: UserRole[];
  department: string | null;
  is_admin: boolean;
  onboarding_completed: boolean;
  role_onboarding_completed: boolean;
}

export interface Invite {
  id: string;
  org_id: string;
  email: string;
  role: UserRole;
  department: string | null;
  token: string;
  used: boolean;
  created_at: string;
  expires_at: string;
}

export interface AuthResponse {
  user?: User | null;
  session?: Session | null;
  error?: any;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  organization: Organization | null;
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
  isAdmin: () => boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, fullName: string, orgName?: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  inviteUser: (email: string, role: UserRole, department?: string) => Promise<{ success: boolean; error?: string }>;
  acceptInvite: (token: string, password: string, fullName: string) => Promise<AuthResponse>;
  transferAdmin: (newAdminId: string) => Promise<{ success: boolean; error?: string }>;
}

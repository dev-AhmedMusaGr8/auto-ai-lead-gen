
import { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'sales_rep' | 'service_advisor' | 'finance_admin' | 'marketing' | 'manager';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  dealership_id: string | null;
  roles: UserRole[];
  onboarding_completed: boolean;
  role_onboarding_completed: boolean;
}

export interface AuthResponse {
  user?: User | null;
  session?: any | null;
  error?: any;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, fullName: string, role?: UserRole) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
}


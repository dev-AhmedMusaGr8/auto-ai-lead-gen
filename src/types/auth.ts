
import { User } from '@supabase/supabase-js';

export type UserRole = 'sales_rep' | 'service_advisor' | 'finance_admin' | 'manager' | 'marketing';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  dealership_id: string | null;
  roles: UserRole[];
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}


import { User, Session } from '@supabase/supabase-js';
import { UserProfile, UserRole } from '@/types/auth';

export interface AuthResponse {
  user?: User | null;
  session?: Session | null;
  error?: any;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, fullName: string, role?: UserRole) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  inviteUser: (email: string, role: UserRole, dealershipId: string) => Promise<{ success: boolean; error?: string }>;
}

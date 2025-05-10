
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Sidebar } from '@/components/ui/sidebar';
import { 
  Users, 
  ShoppingCart, 
  BarChartHorizontal, 
  Calendar, 
  Settings, 
  Briefcase, 
  FileText,
  Car,
  MessageSquare,
  Bell,
  LogOut,
  Shield,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Format role for display
const formatRole = (role: string): string => {
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Define role-based navigation items
const getRoleNavItems = (role: string) => {
  const navItems = {
    admin: [
      { label: 'Dashboard', icon: BarChartHorizontal, href: '/dashboard/admin' },
      { label: 'Contacts', icon: Users, href: '/contacts' },
      { label: 'Companies', icon: Briefcase, href: '/companies' },
      { label: 'Deals', icon: ShoppingCart, href: '/deals' },
      { label: 'Inventory', icon: Car, href: '/inventory' },
      { label: 'Calendar', icon: Calendar, href: '/calendar' },
      { label: 'Messages', icon: MessageSquare, href: '/messages' },
      { label: 'Documents', icon: FileText, href: '/documents' },
      { label: 'Settings', icon: Settings, href: '/settings' },
    ],
    sales_rep: [
      { label: 'Dashboard', icon: BarChartHorizontal, href: '/dashboard/sales' },
      { label: 'Contacts', icon: Users, href: '/contacts' },
      { label: 'Deals', icon: ShoppingCart, href: '/deals' },
      { label: 'Inventory', icon: Car, href: '/inventory' },
      { label: 'Calendar', icon: Calendar, href: '/calendar' },
      { label: 'Messages', icon: MessageSquare, href: '/messages' },
    ],
    service_advisor: [
      { label: 'Dashboard', icon: BarChartHorizontal, href: '/dashboard/service' },
      { label: 'Service Appointments', icon: Calendar, href: '/service' },
      { label: 'Contacts', icon: Users, href: '/contacts' },
      { label: 'Messages', icon: MessageSquare, href: '/messages' },
    ],
    finance_admin: [
      { label: 'Dashboard', icon: BarChartHorizontal, href: '/dashboard/finance' },
      { label: 'Deals', icon: ShoppingCart, href: '/deals' },
      { label: 'Documents', icon: FileText, href: '/documents' },
      { label: 'Calendar', icon: Calendar, href: '/calendar' },
    ],
    marketing: [
      { label: 'Dashboard', icon: BarChartHorizontal, href: '/dashboard/marketing' },
      { label: 'Campaigns', icon: Bell, href: '/campaigns' },
      { label: 'Contacts', icon: Users, href: '/contacts' },
      { label: 'Companies', icon: Briefcase, href: '/companies' },
    ],
    manager: [
      { label: 'Dashboard', icon: BarChartHorizontal, href: '/dashboard/admin' },
      { label: 'Contacts', icon: Users, href: '/contacts' },
      { label: 'Deals', icon: ShoppingCart, href: '/deals' },
      { label: 'Inventory', icon: Car, href: '/inventory' },
      { label: 'Calendar', icon: Calendar, href: '/calendar' },
      { label: 'Settings', icon: Settings, href: '/settings' },
    ],
  };

  return navItems[role as keyof typeof navItems] || navItems.admin;
};

const RoleDashboardLayout = () => {
  const { profile, isLoading, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [localLoading, setLocalLoading] = useState(true);
  const [activeRole, setActiveRole] = useState<string>('admin');
  
  console.log("RoleDashboardLayout: Current location", location.pathname);
  console.log("RoleDashboardLayout: Current user profile", profile);
  
  // Force profile refresh when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      setLocalLoading(true);
      if (refreshProfile) {
        console.log("RoleDashboardLayout: Refreshing profile data");
        try {
          const updatedProfile = await refreshProfile();
          console.log("RoleDashboardLayout: Profile after refresh:", updatedProfile);
          
          if (updatedProfile?.roles?.[0]) {
            setActiveRole(updatedProfile.roles[0]);
          }
        } catch (error) {
          console.error("Error refreshing profile:", error);
        }
      }
      setLocalLoading(false);
    };

    loadProfile();
  }, [refreshProfile]);
  
  useEffect(() => {
    if (!isLoading && !profile && !localLoading) {
      console.log("RoleDashboardLayout: No profile found, redirecting to signin");
      navigate('/signin');
    }
  }, [profile, isLoading, localLoading, navigate]);
  
  useEffect(() => {
    if (profile?.roles?.[0] && profile.roles[0] !== activeRole) {
      setActiveRole(profile.roles[0]);
    }
  }, [profile, activeRole]);
  
  const navItems = getRoleNavItems(activeRole);
  
  if (isLoading || localLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }
  
  if (!profile) {
    return null; // Will redirect via the useEffect
  }
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  const roleColor = profile.is_admin ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800';
  const role = profile.roles?.[0] || 'admin';
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center">
              <div className="bg-[#6366F1] p-1 rounded-lg mr-2">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="6" fill="#6366F1" />
                  <path d="M7.5 7.5H12.5L16.5 12L12.5 16.5H7.5V7.5Z" fill="white" />
                </svg>
              </div>
              <span className="text-xl font-bold">AutoCRMAI</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-3">
              {navItems.map((item, index) => (
                <Link 
                  key={index}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.href || 
                    (item.href === '/dashboard/admin' && location.pathname === '/dashboard') ? 
                    'bg-gray-200' : 'hover:bg-gray-200'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="p-4 border-t">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2 text-gray-700 font-medium">
                {profile.full_name ? profile.full_name.charAt(0) : 'U'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium truncate">{profile.full_name || 'User'}</p>
                <div className="flex items-center">
                  {profile.is_admin ? (
                    <div className="flex items-center">
                      <Badge variant="secondary" className={roleColor}>
                        <Shield className="w-3 h-3 mr-1" />
                        {formatRole(role)}
                      </Badge>
                    </div>
                  ) : (
                    <Badge variant="secondary" className={roleColor}>
                      {formatRole(role)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center" 
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </Sidebar>
      
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default RoleDashboardLayout;

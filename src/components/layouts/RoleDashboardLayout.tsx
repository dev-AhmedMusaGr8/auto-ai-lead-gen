
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define role-based navigation items
const getRoleNavItems = (role: string) => {
  const navItems = {
    admin: [
      { label: 'Dashboard', icon: BarChartHorizontal, href: '/dashboard' },
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
      { label: 'Dashboard', icon: BarChartHorizontal, href: '/dashboard' },
      { label: 'Contacts', icon: Users, href: '/contacts' },
      { label: 'Deals', icon: ShoppingCart, href: '/deals' },
      { label: 'Inventory', icon: Car, href: '/inventory' },
      { label: 'Calendar', icon: Calendar, href: '/calendar' },
      { label: 'Messages', icon: MessageSquare, href: '/messages' },
    ],
    service_advisor: [
      { label: 'Dashboard', icon: BarChartHorizontal, href: '/dashboard' },
      { label: 'Service Appointments', icon: Calendar, href: '/service' },
      { label: 'Contacts', icon: Users, href: '/contacts' },
      { label: 'Messages', icon: MessageSquare, href: '/messages' },
    ],
    finance_admin: [
      { label: 'Dashboard', icon: BarChartHorizontal, href: '/dashboard' },
      { label: 'Deals', icon: ShoppingCart, href: '/deals' },
      { label: 'Documents', icon: FileText, href: '/documents' },
      { label: 'Calendar', icon: Calendar, href: '/calendar' },
    ],
    marketing: [
      { label: 'Dashboard', icon: BarChartHorizontal, href: '/dashboard' },
      { label: 'Campaigns', icon: Bell, href: '/campaigns' },
      { label: 'Contacts', icon: Users, href: '/contacts' },
      { label: 'Companies', icon: Briefcase, href: '/companies' },
    ],
    manager: [
      { label: 'Dashboard', icon: BarChartHorizontal, href: '/dashboard' },
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
  const { profile, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const role = profile?.roles?.[0] || 'admin';
  
  useEffect(() => {
    if (!isLoading && !profile) {
      navigate('/signin');
    }
  }, [profile, isLoading, navigate]);
  
  const navItems = getRoleNavItems(role);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!profile) {
    return null; // Will redirect via the useEffect
  }
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };
  
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
                <a 
                  key={index}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          
          <div className="p-4 border-t">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                {profile.full_name ? profile.full_name.charAt(0) : 'U'}
              </div>
              <div>
                <p className="text-sm font-medium">{profile.full_name || 'User'}</p>
                <p className="text-xs text-gray-500">{role.replace('_', ' ')}</p>
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

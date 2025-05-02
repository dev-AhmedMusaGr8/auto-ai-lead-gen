
import React from 'react';
import { Outlet } from 'react-router-dom';
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
  Bell
} from 'lucide-react';

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
  const { profile } = useAuth();
  const role = profile?.roles?.[0] || 'admin';
  
  const navItems = getRoleNavItems(role);
  
  return (
    <div className="flex h-screen">
      <Sidebar navItems={navItems} />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default RoleDashboardLayout;

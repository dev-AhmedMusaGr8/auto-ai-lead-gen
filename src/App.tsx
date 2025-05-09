
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/auth";
import { AIProvider } from "./contexts/AIContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import OnboardingLayout from "./components/layouts/OnboardingLayout";
import RoleOnboardingLayout from "./components/layouts/RoleOnboardingLayout";
import RoleDashboardLayout from "./components/layouts/RoleDashboardLayout";
import SalesRepOnboarding from "./pages/role-onboarding/SalesRepOnboarding";
import ServiceAdvisorOnboarding from "./pages/role-onboarding/ServiceAdvisorOnboarding";
import CreateOrganization from "./pages/organization/CreateOrganization";
import AcceptInvite from "./pages/invite/AcceptInvite";

// Onboarding pages
import Welcome from "./pages/onboarding/Welcome";
import Dealership from "./pages/onboarding/Dealership";
import Inventory from "./pages/onboarding/Inventory";
import Team from "./pages/onboarding/Team";
import Complete from "./pages/onboarding/Complete";

// Department-specific dashboard pages
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import SalesDashboard from "./pages/dashboard/SalesDashboard";
import HRDashboard from "./pages/dashboard/HRDashboard";
import FinanceDashboard from "./pages/dashboard/FinanceDashboard";
import SupportDashboard from "./pages/dashboard/SupportDashboard";

// Role onboarding pages
import HROnboarding from "./pages/role-onboarding/HROnboarding";
import FinanceOnboarding from "./pages/role-onboarding/FinanceOnboarding";
import SupportOnboarding from "./pages/role-onboarding/SupportOnboarding";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route that checks authentication status
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

// Route that checks if user needs an organization
const OrgRequiredRoute = ({ children }: { children: React.ReactNode }) => {
  const { profile, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!profile) {
    return <Navigate to="/signin" replace />;
  }
  
  if (!profile.org_id && !profile.dealership_id) {
    return <Navigate to="/organization/create" replace />;
  }
  
  return <>{children}</>;
};

// Route that checks if user needs admin onboarding
const AdminOnboardingRoute = ({ children }: { children: React.ReactNode }) => {
  const { profile, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!profile) {
    return <Navigate to="/signin" replace />;
  }
  
  // If the user isn't an admin, redirect to role onboarding or dashboard
  if (!profile.is_admin) {
    if (!profile.role_onboarding_completed) {
      const roleRoutes: Record<string, string> = {
        'sales': '/role-onboarding/sales',
        'hr': '/role-onboarding/hr',
        'finance': '/role-onboarding/finance',
        'support': '/role-onboarding/support',
        'sales_rep': '/role-onboarding/sales',
        'service_advisor': '/role-onboarding/service',
        'finance_admin': '/role-onboarding/finance',
        'marketing': '/role-onboarding/marketing',
      };
      return <Navigate to={roleRoutes[profile.roles?.[0] || ''] || '/dashboard'} replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  // If admin onboarding is completed, redirect to dashboard
  if (profile.onboarding_completed) {
    return <Navigate to="/dashboard/admin" replace />;
  }
  
  return <>{children}</>;
};

// Route that checks if user needs role-specific onboarding
const RoleOnboardingRoute = ({ children }: { children: React.ReactNode }) => {
  const { profile, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!profile) {
    return <Navigate to="/signin" replace />;
  }
  
  // Admin users don't need role onboarding
  if (profile.is_admin) {
    return <Navigate to="/dashboard/admin" replace />;
  }
  
  // If role onboarding is completed, redirect to dashboard
  if (profile.role_onboarding_completed) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Route that checks if user has completed all onboarding requirements
const DashboardRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { profile, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!profile) {
    return <Navigate to="/signin" replace />;
  }

  // Check for organization
  if (!profile.org_id && !profile.dealership_id) {
    return <Navigate to="/organization/create" replace />;
  }
  
  // Admin must complete onboarding
  if (profile.is_admin && !profile.onboarding_completed) {
    return <Navigate to="/onboarding/welcome" replace />;
  }
  
  // Non-admin must complete role onboarding
  if (!profile.is_admin && !profile.role_onboarding_completed) {
    const roleRoutes: Record<string, string> = {
      'sales': '/role-onboarding/sales',
      'hr': '/role-onboarding/hr',
      'finance': '/role-onboarding/finance',
      'support': '/role-onboarding/support',
      'sales_rep': '/role-onboarding/sales',
      'service_advisor': '/role-onboarding/service',
      'finance_admin': '/role-onboarding/finance',
      'marketing': '/role-onboarding/marketing',
    };
    return <Navigate to={roleRoutes[profile.roles?.[0] || ''] || '/dashboard'} replace />;
  }
  
  // Admin only routes
  if (adminOnly && !profile.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Define the App component outside of the export to avoid hook issues
const AppContent = () => {
  const { refreshProfile } = useAuth();
  
  // Refresh profile on initial app load
  useEffect(() => {
    if (refreshProfile) {
      refreshProfile();
    }
  }, [refreshProfile]);
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/invite/accept" element={<AcceptInvite />} />
      
      {/* Organization Creation */}
      <Route path="/organization/create" element={
        <ProtectedRoute>
          <CreateOrganization />
        </ProtectedRoute>
      } />
      
      {/* Admin Onboarding - Protected and only for admins who need onboarding */}
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <OrgRequiredRoute>
            <AdminOnboardingRoute>
              <OnboardingLayout />
            </AdminOnboardingRoute>
          </OrgRequiredRoute>
        </ProtectedRoute>
      }>
        <Route path="welcome" element={<Welcome />} />
        <Route path="dealership" element={<Dealership />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="team" element={<Team />} />
        <Route path="complete" element={<Complete />} />
      </Route>
      
      {/* Role-specific Onboarding - Protected and only for non-admins who need role onboarding */}
      <Route path="/role-onboarding" element={
        <ProtectedRoute>
          <OrgRequiredRoute>
            <RoleOnboardingRoute>
              <RoleOnboardingLayout />
            </RoleOnboardingRoute>
          </OrgRequiredRoute>
        </ProtectedRoute>
      }>
        <Route path="sales" element={<SalesRepOnboarding />} />
        <Route path="service" element={<ServiceAdvisorOnboarding />} />
        <Route path="hr" element={<HROnboarding />} />
        <Route path="finance" element={<FinanceOnboarding />} />
        <Route path="support" element={<SupportOnboarding />} />
      </Route>
      
      {/* Role-based Dashboard - Protected and requires completed onboarding */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <OrgRequiredRoute>
            <DashboardRoute>
              <RoleDashboardLayout />
            </DashboardRoute>
          </OrgRequiredRoute>
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} /> {/* Default to admin dashboard */}
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="sales" element={<SalesDashboard />} />
        <Route path="hr" element={<HRDashboard />} />
        <Route path="finance" element={<FinanceDashboard />} />
        <Route path="support" element={<SupportDashboard />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AIProvider>
          <OnboardingProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppContent />
            </TooltipProvider>
          </OnboardingProvider>
        </AIProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;

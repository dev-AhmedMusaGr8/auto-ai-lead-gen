
import React from "react";
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

// Onboarding pages
import Welcome from "./pages/onboarding/Welcome";
import Dealership from "./pages/onboarding/Dealership";
import Inventory from "./pages/onboarding/Inventory";
import Team from "./pages/onboarding/Team";
import Complete from "./pages/onboarding/Complete";

const queryClient = new QueryClient();

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
  if (profile.roles?.[0] !== 'admin') {
    if (!profile.role_onboarding_completed) {
      const roleRoutes: Record<string, string> = {
        'sales_rep': '/role-onboarding/sales',
        'service_advisor': '/role-onboarding/service',
        'finance_admin': '/role-onboarding/finance',
        'marketing': '/role-onboarding/marketing',
        'manager': '/role-onboarding/manager'
      };
      return <Navigate to={roleRoutes[profile.roles[0]] || '/dashboard'} replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  // If admin onboarding is completed, redirect to dashboard
  if (profile.onboarding_completed) {
    return <Navigate to="/dashboard" replace />;
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
  if (profile.roles?.[0] === 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If role onboarding is completed, redirect to dashboard
  if (profile.role_onboarding_completed) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Route that checks if user has completed all onboarding requirements
const DashboardRoute = ({ children }: { children: React.ReactNode }) => {
  const { profile, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!profile) {
    return <Navigate to="/signin" replace />;
  }
  
  // Admin must complete onboarding
  if (profile.roles?.[0] === 'admin' && !profile.onboarding_completed) {
    return <Navigate to="/onboarding/welcome" replace />;
  }
  
  // Non-admin must complete role onboarding
  if (profile.roles?.[0] !== 'admin' && !profile.role_onboarding_completed) {
    const roleRoutes: Record<string, string> = {
      'sales_rep': '/role-onboarding/sales',
      'service_advisor': '/role-onboarding/service',
      'finance_admin': '/role-onboarding/finance',
      'marketing': '/role-onboarding/marketing',
      'manager': '/role-onboarding/manager'
    };
    return <Navigate to={roleRoutes[profile.roles[0]] || '/dashboard'} replace />;
  }
  
  return <>{children}</>;
};

// Define the App component outside of the export to avoid hook issues
const AppContent = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/signin" element={<SignIn />} />
      
      {/* Admin Onboarding - Protected and only for admins who need onboarding */}
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <AdminOnboardingRoute>
            <OnboardingLayout />
          </AdminOnboardingRoute>
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
          <RoleOnboardingRoute>
            <RoleOnboardingLayout />
          </RoleOnboardingRoute>
        </ProtectedRoute>
      }>
        <Route path="sales" element={<SalesRepOnboarding />} />
        <Route path="service" element={<ServiceAdvisorOnboarding />} />
      </Route>
      
      {/* Role-based Dashboard - Protected and requires completed onboarding */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardRoute>
            <RoleDashboardLayout />
          </DashboardRoute>
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
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

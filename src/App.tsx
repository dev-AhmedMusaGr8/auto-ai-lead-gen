
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
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

// Define ProtectedRoute as a separate component using hooks
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/signin" />;
  }
  
  return <>{children}</>;
};

// Define the App component outside of the export to avoid hook issues
const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/signin" element={<SignIn />} />
      
      {/* Admin Onboarding */}
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <OnboardingLayout />
        </ProtectedRoute>
      }>
        <Route path="welcome" element={<Welcome />} />
        <Route path="dealership" element={<Dealership />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="team" element={<Team />} />
        <Route path="complete" element={<Complete />} />
      </Route>
      
      {/* Role-specific Onboarding */}
      <Route path="/role-onboarding" element={
        <ProtectedRoute>
          <RoleOnboardingLayout />
        </ProtectedRoute>
      }>
        <Route path="sales" element={<SalesRepOnboarding />} />
        <Route path="service" element={<ServiceAdvisorOnboarding />} />
      </Route>
      
      {/* Role-based Dashboard */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <RoleDashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
      </Route>
      
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

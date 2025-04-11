
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Deals from "./pages/Deals";
import Contacts from "./pages/Contacts";
import Companies from "./pages/Companies";
import DashboardLayout from "./components/layouts/DashboardLayout";
import OnboardingLayout from "./components/layouts/OnboardingLayout";
import { OnboardingProvider } from "./contexts/OnboardingContext";

// Onboarding pages
import Welcome from "./pages/onboarding/Welcome";
import Dealership from "./pages/onboarding/Dealership";
import Inventory from "./pages/onboarding/Inventory";
import Team from "./pages/onboarding/Team";
import Complete from "./pages/onboarding/Complete";

// Set up the query client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <OnboardingProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            
            {/* Onboarding routes */}
            <Route path="/onboarding" element={<OnboardingLayout />}>
              <Route path="welcome" element={<Welcome />} />
              <Route path="dealership" element={<Dealership />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="team" element={<Team />} />
              <Route path="complete" element={<Complete />} />
            </Route>
            
            {/* Dashboard routes with layout */}
            <Route path="/" element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/companies" element={<Companies />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </OnboardingProvider>
  </QueryClientProvider>
);

export default App;

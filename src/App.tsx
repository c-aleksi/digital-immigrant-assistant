import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { OnboardingGuard } from "@/components/OnboardingGuard";
import { OnboardingRedirect } from "@/components/OnboardingRedirect";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";

import Welcome from "@/pages/Welcome";
import ScenarioSelect from "@/pages/ScenarioSelect";
import MunicipalitySelect from "@/pages/MunicipalitySelect";
import EmailOptIn from "@/pages/EmailOptIn";
import Dashboard from "@/pages/Dashboard";
import RouteStepDetail from "@/pages/RouteStepDetail";
import Article from "@/pages/Article";
import LocalResources from "@/pages/LocalResources";
import SearchPage from "@/pages/SearchPage";
import Contacts from "@/pages/Contacts";
import Profile from "@/pages/Profile";
import BundleLibrary from "@/pages/BundleLibrary";
import NotFound from "@/pages/NotFound";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminSubscribers from "@/pages/admin/AdminSubscribers";
import AdminContent from "@/pages/admin/AdminContent";
import AdminContentEdit from "@/pages/admin/AdminContentEdit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <ProgressProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<OnboardingRedirect><Welcome /></OnboardingRedirect>} />
            <Route path="/onboarding/scenario" element={<OnboardingRedirect><ScenarioSelect /></OnboardingRedirect>} />
            <Route path="/onboarding/municipality" element={<OnboardingRedirect><MunicipalitySelect /></OnboardingRedirect>} />
            <Route path="/onboarding/email" element={<OnboardingRedirect><EmailOptIn /></OnboardingRedirect>} />

            <Route path="/dashboard" element={<OnboardingGuard><Dashboard /></OnboardingGuard>} />
            <Route path="/step/:id" element={<OnboardingGuard><RouteStepDetail /></OnboardingGuard>} />
            <Route path="/article/:id" element={<OnboardingGuard><Article /></OnboardingGuard>} />
            <Route path="/resources" element={<OnboardingGuard><LocalResources /></OnboardingGuard>} />
            <Route path="/search" element={<OnboardingGuard><SearchPage /></OnboardingGuard>} />
            <Route path="/contacts" element={<OnboardingGuard><Contacts /></OnboardingGuard>} />
            <Route path="/library" element={<OnboardingGuard><BundleLibrary /></OnboardingGuard>} />
            <Route path="/profile" element={<OnboardingGuard><Profile /></OnboardingGuard>} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminAuthProvider><AdminLogin /></AdminAuthProvider>} />
            <Route path="/admin/dashboard" element={<AdminAuthProvider><AdminAuthGuard><AdminDashboard /></AdminAuthGuard></AdminAuthProvider>} />
            <Route path="/admin/subscribers" element={<AdminAuthProvider><AdminAuthGuard><AdminSubscribers /></AdminAuthGuard></AdminAuthProvider>} />
            <Route path="/admin/content" element={<AdminAuthProvider><AdminAuthGuard><AdminContent /></AdminAuthGuard></AdminAuthProvider>} />
            <Route path="/admin/content/:id" element={<AdminAuthProvider><AdminAuthGuard><AdminContentEdit /></AdminAuthGuard></AdminAuthProvider>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ProgressProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import MemberAuth from '@/pages/MemberAuth';
import MemberDashboard from '@/pages/MemberDashboard';
import CompetitorChannels from '@/pages/CompetitorChannels';
import UserProfile from '@/pages/UserProfile';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/member-auth" element={<MemberAuth />} />
              <Route path="/member-dashboard" element={<MemberDashboard />} />
              <Route path="/competitor-channels" element={<CompetitorChannels />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

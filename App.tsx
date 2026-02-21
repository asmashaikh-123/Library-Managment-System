import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ActivityLogProvider } from "@/contexts/ActivityLogContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { RoleProtectedRoute } from "@/components/auth/RoleProtectedRoute";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Books from "./pages/Books";
import Members from "./pages/Members";
import Transactions from "./pages/Transactions";
import IssueReturn from "./pages/IssueReturn";
import Scanner from "./pages/Scanner";
import Analytics from "./pages/Analytics";
import ActivityLogs from "./pages/ActivityLogs";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/books" element={<Books />} />
                <Route path="/members" element={<Members />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/issue-return" element={<IssueReturn />} />
                <Route path="/scanner" element={<Scanner />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/activity-logs" element={<ActivityLogs />} />
                {/* Settings is restricted to admin users only */}
                <Route 
                  path="/settings" 
                  element={
                    <RoleProtectedRoute allowedRoles={['admin']}>
                      <Settings />
                    </RoleProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <NotificationProvider>
            <ActivityLogProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </ActivityLogProvider>
          </NotificationProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

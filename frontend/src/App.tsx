import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MainLayout } from "./components/layout/MainLayout";
import { Toaster } from "react-hot-toast";

// Pages
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import PantryDashboard from "./pages/pantryDashboard";
import DeliveryManagement from "./pages/DeliveryDashboard";

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles = [],
}: ProtectedRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (allowedRoles.length > 0 && (!user.role || !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <MainLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    {/* <MainLayout> */}
                    <Dashboard />
                    {/* </MainLayout> */}
                  </ProtectedRoute>
                }
              />

              {/* Pantry Routes */}
              <Route
                path="/pantry"
                element={
                  <ProtectedRoute allowedRoles={["pantry"]}>
                    {/* <MainLayout> */}
                    <PantryDashboard />
                    {/* </MainLayout> */}
                  </ProtectedRoute>
                }
              />

              {/* Delivery Routes */}
              <Route
                path="/delivery"
                element={
                  <ProtectedRoute allowedRoles={["delivery"]}>
                    {/* <MainLayout> */}
                    <DeliveryManagement />
                    {/* </MainLayout> */}
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route for unmatched paths */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MainLayout } from "./components/layout/MainLayout";
import { Provider as ReduxProvider } from "react-redux";
import {store} from "./redux/store";
import { Toaster } from "react-hot-toast";
import SignUp from "./pages/SignUp";
// Pages
import Login from "./pages/Login";
// import Dashboard from './pages/Dashboard';
// import Patients from './pages/Patients';
// import DietCharts from './pages/DietCharts';
// import Deliveries from './pages/Deliveries';

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Toaster position="top-right" />
            <MainLayout>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/sign-up" element={<SignUp />} />

                {/* Protected Routes */}
                {/* <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            /> */}

                {/* Manager Routes */}
                {/* <Route
              path="/patients"
              element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <MainLayout>
                    <Patients />
                  </MainLayout>
                </ProtectedRoute>
              }
            /> */}

                {/* <Route
              path="/diet-charts"
              element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <MainLayout>
                    <DietCharts />
                  </MainLayout>
                </ProtectedRoute>
              }
            /> */}

                {/* Pantry Routes */}
                {/* <Route
              path="/kitchen-tasks"
              element={
                <ProtectedRoute allowedRoles={['pantry']}>
                  <MainLayout>
                    <DietCharts />
                  </MainLayout>
                </ProtectedRoute>
              }
            /> */}

                {/* Delivery Routes */}
                {/* <Route
              path="/deliveries"
              element={
                <ProtectedRoute allowedRoles={['delivery']}>
                  <MainLayout>
                    <Deliveries />
                  </MainLayout>
                </ProtectedRoute>
              }
            /> */}
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
};

export default App;


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import Dashboard from "@/pages/dashboard/Dashboard";
import InventoryTracking from "@/pages/inventory/InventoryTracking";
import AssetManagement from "@/pages/assets/AssetManagement";
import ServiceManagement from "@/pages/service/ServiceManagement";
import SalesTracking from "@/pages/sales/SalesTracking";
import Settings from "@/pages/settings/Settings";
import UserManagement from "@/pages/users/UserManagement";
import NotFound from "@/pages/NotFound";
import { AppInitializer } from "@/components/AppInitializer";

function App() {
  return (
    <AuthProvider>
      <AppInitializer />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<InventoryTracking />} />
            <Route path="assets" element={<AssetManagement />} />
            <Route path="service" element={<ServiceManagement />} />
            <Route path="sales" element={<SalesTracking />} />
            <Route path="settings" element={<Settings />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;

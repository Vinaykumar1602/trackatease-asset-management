
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import AssetManagement from "./pages/assets/AssetManagement";
import InventoryTracking from "./pages/inventory/InventoryTracking";
import SalesTracking from "./pages/sales/SalesTracking";
import ServiceManagement from "./pages/service/ServiceManagement";
import Reports from "./pages/reports/Reports";
import UsersManagement from "./pages/users/UsersManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assets" element={<AssetManagement />} />
            <Route path="/inventory" element={<InventoryTracking />} />
            <Route path="/sales" element={<SalesTracking />} />
            <Route path="/service" element={<ServiceManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/users" element={<UsersManagement />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

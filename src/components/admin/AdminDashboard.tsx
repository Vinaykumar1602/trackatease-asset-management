
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInitializeData } from '@/hooks/useInitializeData';
import { Users, Package, FileText, BarChart3, LayoutDashboard, Settings, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
  const { isInitializing, hasInitialized, initializeData } = useInitializeData();
  const navigate = useNavigate();

  const adminModules = [
    {
      title: "User Management",
      description: "Manage users, roles and permissions",
      icon: Users,
      path: "/users"
    },
    {
      title: "Asset Management",
      description: "Track and manage company assets",
      icon: Package,
      path: "/assets"
    },
    {
      title: "Service Management",
      description: "Handle service requests and maintenance",
      icon: FileText,
      path: "/service"
    },
    {
      title: "Reports",
      description: "View and generate reports",
      icon: BarChart3,
      path: "/reports"
    },
    {
      title: "Dashboard",
      description: "Overview of system metrics",
      icon: LayoutDashboard,
      path: "/dashboard"
    },
    {
      title: "System Settings",
      description: "Configure application settings",
      icon: Settings,
      path: "/settings"
    }
  ];

  // Removed admin restriction check - all users now have access

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
        <p className="text-muted-foreground">Manage your application settings and data.</p>
      </div>

      {import.meta.env.DEV && (
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Initialize or reset your application data for testing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={initializeData} 
              disabled={isInitializing || hasInitialized}
            >
              {isInitializing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Initializing...
                </>
              ) : hasInitialized ? (
                "Data Initialized"
              ) : (
                "Initialize Application Data"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminModules.map((module) => (
          <Card 
            key={module.title} 
            className="cursor-pointer hover:bg-accent/10 transition-colors"
            onClick={() => navigate(module.path)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <module.icon className="h-5 w-5" />
                {module.title}
              </CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

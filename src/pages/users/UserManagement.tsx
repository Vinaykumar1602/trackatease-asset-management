
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

export default function UserManagement() {
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const handleAction = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Coming soon",
        description: "This feature is not yet implemented",
      });
    }, 1000);
  };

  if (!isAdmin) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You need administrator privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage user accounts and assign roles.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleAction} disabled={loading}>
              {loading ? "Loading..." : "Manage Users"}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>Configure user roles and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleAction} disabled={loading}>
              {loading ? "Loading..." : "Manage Roles"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

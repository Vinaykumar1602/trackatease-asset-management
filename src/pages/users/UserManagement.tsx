
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

  // Removed admin restriction check - all users now have access

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

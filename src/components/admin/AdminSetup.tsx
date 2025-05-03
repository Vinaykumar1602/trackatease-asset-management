
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminTools } from "@/utils/adminUtils";
import { Shield, CheckCircle, RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function AdminSetup() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Admin123!");
  const [name, setName] = useState("System Administrator");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
  const [adminCheckResult, setAdminCheckResult] = useState<boolean | null>(null);
  
  const { setupAdminUser, checkAdminStatus } = useAdminTools();
  const { user, isAdmin, refreshProfile } = useAuth();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Email and password are required",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Creating admin user:", email);
      const success = await setupAdminUser(email, password, name);
      
      if (success) {
        console.log("Admin user created successfully");
        setIsComplete(true);
        
        // Show the credentials to the user
        toast({
          title: "Admin Account Created",
          description: `Email: ${email}, Password: ${password}`,
          duration: 10000 // Show for 10 seconds
        });
        
        // Add another toast with clear instructions
        toast({
          title: "Login Instructions",
          description: "Please use these credentials to log in. You may need to log out first if you're currently logged in.",
          duration: 15000
        });
        
        // If the user is already logged in, refresh their profile
        if (user) {
          await refreshProfile();
          
          // Check again if the user is an admin after refreshing profile
          const isUserAdmin = await checkAdminStatus();
          
          if (isUserAdmin) {
            toast({
              title: "Admin Access Updated",
              description: "Your account now has administrator privileges.",
            });
          }
        }
      } else {
        console.log("Failed to create admin user");
      }
    } catch (error: any) {
      console.error("Error creating admin account:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while creating the admin account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const checkCurrentAdminStatus = async () => {
    setIsCheckingAdmin(true);
    setAdminCheckResult(null);
    
    try {
      const isUserAdmin = await checkAdminStatus();
      setAdminCheckResult(isUserAdmin);
      
      toast({
        title: isUserAdmin ? "Admin Access Confirmed" : "Not an Admin",
        description: isUserAdmin 
          ? "You have administrator access to this system." 
          : "You do not currently have administrator privileges.",
        duration: 5000
      });
      
      // If we're checking and the user is indeed an admin, refresh their profile
      if (isUserAdmin && user) {
        // Force synchronization between the database and the application state
        await refreshProfile();
        
        // Double check that the profile was updated with admin role
        if (!isAdmin) {
          // Try to fix the discrepancy by directly updating the profile
          const { error } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', user.id);
            
          if (error) {
            console.error("Error updating profile role:", error);
          } else {
            await refreshProfile();
            
            toast({
              title: "Profile Updated",
              description: "Your profile has been updated with admin privileges.",
            });
          }
        }
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setAdminCheckResult(false);
    } finally {
      setIsCheckingAdmin(false);
    }
  };

  useEffect(() => {
    // Check if the current user is admin when component mounts
    if (user) {
      checkCurrentAdminStatus();
    }
  }, [user]);
  
  if (isComplete) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle>Admin Account Created</CardTitle>
          <CardDescription>
            Your admin account has been successfully created.
            You can now log in with the following credentials:
            <div className="mt-4 p-3 bg-muted rounded-md text-left">
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Password:</strong> {password}</p>
            </div>
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={() => window.location.href = "/login"}>
            Go to Login
          </Button>
          <div className="text-sm text-muted-foreground">
            If you're currently logged in, please log out first by clicking on your profile and selecting "Logout".
          </div>
        </CardFooter>
      </Card>
    );
  }

  if (isAdmin) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle>Admin Access Confirmed</CardTitle>
          <CardDescription>
            You already have administrator privileges on this system.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.location.href = "/users"}
          >
            Go to User Management
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <Shield className="h-12 w-12 text-primary" />
        </div>
        <CardTitle>Create Admin Account</CardTitle>
        <CardDescription>
          Set up your administrator account to manage the application
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="System Administrator"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <p className="text-xs text-muted-foreground">Default: Admin123!</p>
          </div>
          
          {user && (
            <div className="mt-4 pt-4 border-t border-muted">
              {adminCheckResult === false && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <p className="text-sm">You are not currently an administrator.</p>
                </div>
              )}
              
              {adminCheckResult === true && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <p className="text-sm">You have administrator privileges.</p>
                </div>
              )}
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={checkCurrentAdminStatus}
                disabled={isCheckingAdmin}
              >
                {isCheckingAdmin ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>Check Current Admin Status</>
                )}
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Admin Account"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

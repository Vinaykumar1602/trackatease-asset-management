
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [department, setDepartment] = useState("");

  // Initialize form with profile data when available
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setAvatarUrl(profile.avatar_url || "");
      setDepartment(profile.department || "");
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name,
          avatar_url: avatarUrl,
          department
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      await refreshProfile();
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <form onSubmit={handleUpdateProfile}>
            <CardContent className="space-y-4">
              <div className="flex justify-center py-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-xl bg-primary text-white">
                    {name ? getInitials(name) : "??"}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  readOnly
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input
                  id="avatarUrl"
                  placeholder="https://example.com/avatar.png"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="IT, Finance, etc."
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>View your account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Account ID</Label>
              <div className="rounded-md bg-muted p-2 text-sm font-mono">
                {user?.id || "Not available"}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <div className="rounded-md bg-muted p-2">
                <span className="capitalize">{profile?.role || "User"}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Account Created</Label>
              <div className="rounded-md bg-muted p-2">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Not available"}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Last Sign In</Label>
              <div className="rounded-md bg-muted p-2">
                {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "Not available"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

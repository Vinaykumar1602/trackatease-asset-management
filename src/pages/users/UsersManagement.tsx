
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Download, 
  Upload, 
  Plus, 
  Search,
  Filter,
  UserPlus,
  ShieldCheck,
  Settings,
  UserCog,
  RefreshCw
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddUserDialog } from "./components/AddUserDialog";
import { EditUserDialog } from "./components/EditUserDialog";
import { User, sampleUsers, Role, sampleRoles } from "./types";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteUserDialog } from "./components/DeleteUserDialog";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RolesManagement from "./components/RolesManagement";
import { initializeAllDemoData } from "@/utils/demoData";

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [roles, setRoles] = useState<Role[]>(sampleRoles);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInitializingData, setIsInitializingData] = useState(false);

  const { user: authUser, isAdmin, checkAdminRole } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authUser) {
      fetchUsers();
    }
  }, [authUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (
            role
          )
        `);
        
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        
        // If there's an error fetching, use sample data in development
        if (import.meta.env.DEV) {
          setUsers(sampleUsers);
          toast({
            title: "Using Sample Data",
            description: "Using sample user data for development",
          });
        } else {
          throw profilesError;
        }
        return;
      }
      
      if (profilesData && profilesData.length > 0) {
        const formattedUsers: User[] = profilesData.map(profile => {
          // Extract role safely
          const userRole = profile.role || 'user';
          
          return {
            id: profile.id,
            name: profile.name || profile.email?.split('@')[0] || "User",
            email: profile.email || "",
            role: userRole,
            department: profile.department || "General",
            status: "Active" as const,  // Explicitly type as 'Active'
            lastLogin: profile.updated_at ? new Date(profile.updated_at).toLocaleString() : "Never",
            permissions: []
          };
        });
        
        setUsers(formattedUsers);
      } else {
        // If no data is returned, use sample data in development
        if (import.meta.env.DEV) {
          setUsers(sampleUsers);
          toast({
            title: "Using Sample Data",
            description: "Using sample user data for development",
          });
        } else {
          setUsers([]);
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
      
      // Use sample data in development
      if (import.meta.env.DEV) {
        setUsers(sampleUsers);
      }
    } finally {
      setLoading(false);
    }
  };

  const syncUserAdminStatus = async () => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only administrators can perform this action",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSyncing(true);
      toast({
        title: "Syncing",
        description: "Syncing user roles and permissions...",
      });
      
      // Check logged in user's admin status first
      await checkAdminRole();
      
      // Fetch all users and update their role status
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, role');
        
      if (profiles) {
        for (const profile of profiles) {
          // Check if user has admin role in user_roles table
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.id)
            .eq('role', 'admin')
            .maybeSingle();
            
          const isUserAdmin = roleData?.role === 'admin';
          
          // If there's a mismatch, update the profile
          if (isUserAdmin && profile.role !== 'admin') {
            await supabase
              .from('profiles')
              .update({ role: 'admin' })
              .eq('id', profile.id);
          }
          
          // If profile has admin role but no entry in user_roles, add it
          if (profile.role === 'admin' && !isUserAdmin) {
            await supabase
              .from('user_roles')
              .upsert({
                user_id: profile.id,
                role: 'admin'
              });
          }
        }
      }
      
      // Refresh user list
      await fetchUsers();
      
      toast({
        title: "Sync Complete",
        description: "User roles and permissions have been synchronized",
      });
    } catch (error) {
      console.error("Error syncing user roles:", error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync user roles and permissions",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const initializeDemoDataHandler = async () => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only administrators can initialize demo data",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsInitializingData(true);
      toast({
        title: "Initializing",
        description: "Adding demo data to the system...",
      });
      
      await initializeAllDemoData();
      
      toast({
        title: "Data Initialized",
        description: "Demo data has been added to the system successfully",
      });
      
      // Refresh user list after adding demo data
      await fetchUsers();
      
    } catch (error) {
      console.error("Error initializing demo data:", error);
      toast({
        title: "Initialization Failed",
        description: "Failed to add demo data to the system",
        variant: "destructive"
      });
    } finally {
      setIsInitializingData(false);
    }
  };

  const handleAddUser = async (userData: Omit<User, "id" | "lastLogin">) => {
    try {
      if (!isAdmin) {
        toast({
          title: "Permission Denied",
          description: "Only administrators can add new users",
          variant: "destructive"
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .insert([{ 
          email: userData.email, 
          name: userData.name, 
          role: userData.role, 
          department: userData.department, 
          id: crypto.randomUUID() 
        }])
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        const newUser: User = {
          ...userData,
          id: data[0].id,
          lastLogin: "Never",
          status: 'Active'
        };
        
        // If user role is admin, add to user_roles table
        if (userData.role === 'admin') {
          await supabase
            .from('user_roles')
            .upsert({
              user_id: data[0].id,
              role: 'admin'
            });
        }
        
        setUsers(prev => [...prev, newUser]);
        
        toast({
          title: "User Added",
          description: `${newUser.name} has been added to the system.`
        });
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive"
      });
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      if (!isAdmin) {
        toast({
          title: "Permission Denied",
          description: "Only administrators can update users",
          variant: "destructive"
        });
        return;
      }
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: updatedUser.name,
          email: updatedUser.email,
          department: updatedUser.department,
          role: updatedUser.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedUser.id);
      
      if (profileError) throw profileError;

      // Handle user_roles based on the role change
      if (updatedUser.role === 'admin') {
        // Ensure user has admin role in user_roles table
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: updatedUser.id,
            role: 'admin'
          });
        
        if (roleError) throw roleError;
      } else {
        // Remove admin role if user is not admin anymore
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', updatedUser.id)
          .eq('role', 'admin');
      }
      
      setUsers(prev => prev.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      
      setEditingUser(null);
      
      toast({
        title: "User Updated",
        description: "The user profile has been updated."
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const handleExportUsers = () => {
    const headers = ["ID", "Name", "Email", "Role", "Department", "Status", "Last Login"];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => 
        [user.id, user.name, user.email, user.role, user.department, user.status, user.lastLogin].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "users.csv");
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Users data has been exported to CSV."
    });
  };

  const handleImportUsers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim());
        
        const importedUsers = rows.slice(1).map(row => {
          const values = row.split(',');
          return {
            email: values[2] || "",
            name: values[1] || "",
            role: values[3] || "user",
            department: values[4] || "General",
          };
        });
        
        const validUsers = importedUsers.filter(user => user.name && user.email);
        
        if (validUsers.length > 0) {
          const userProfiles = validUsers.map(user => ({
            email: user.email,
            name: user.name,
            role: user.role,
            department: user.department,
            id: crypto.randomUUID()
          }));
          
          const { data, error } = await supabase
            .from('profiles')
            .insert(userProfiles)
            .select();
          
          if (error) throw error;
          
          if (data) {
            const newUsers = data.map(item => ({
              id: item.id,
              name: item.name,
              email: item.email,
              role: item.role,
              department: item.department,
              status: "Active" as const,
              lastLogin: "Never",
              permissions: []
            }));
            
            setUsers(prev => [...prev, ...newUsers]);
            
            toast({
              title: "Import Successful",
              description: `${newUsers.length} users have been imported.`
            });
          }
        }
      } catch (error) {
        console.error("Error importing users:", error);
        toast({
          title: "Import Failed",
          description: "There was an error importing the file. Please check the format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      if (!isAdmin) {
        toast({
          title: "Permission Denied",
          description: "Only administrators can delete users",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
      
      setUsers(prev => prev.filter(user => user.id !== userId));
      setDeletingUser(null);
      
      toast({
        title: "User Deleted",
        description: "The user has been permanently deleted."
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      searchQuery === "" || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesRole = roleFilter === "All" || String(user.role).toLowerCase() === roleFilter.toLowerCase();
    
    const matchesStatus = statusFilter === "All" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (!isAdmin && !import.meta.env.DEV) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">You need administrator privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and assign roles.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={syncUserAdminStatus}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Sync Roles
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={initializeDemoDataHandler}
            disabled={isInitializingData}
          >
            {isInitializingData ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Add Demo Data
          </Button>
          <AddUserDialog onSave={handleAddUser} />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Roles & Permissions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search users..." 
                className="pl-8 w-full" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" size="sm" onClick={handleExportUsers}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Import
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv"
                  className="hidden"
                  onChange={handleImportUsers}
                />
              </Button>
              <Select
                value={roleFilter}
                onValueChange={setRoleFilter}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="auditor">Auditor</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                  <SelectItem value="inventory_manager">Inventory Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">Loading users...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      No users found. Add a new user or adjust your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className={authUser && user.email === authUser.email ? "bg-muted/50" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{user.name}</span>
                          {authUser && user.email === authUser.email && (
                            <Badge variant="outline" className="ml-2">You</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "outline"}>
                          {user.role === "admin" && <ShieldCheck className="h-3 w-3 mr-1" />}
                          {String(user.role).charAt(0).toUpperCase() + String(user.role).slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          user.status === "Active" ? "bg-green-100 text-green-800" : 
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditingUser(user)}
                        >
                          Edit
                        </Button>
                        {isAdmin && authUser && user.email !== authUser.email && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setDeletingUser(user)}
                            className="text-destructive hover:text-destructive"
                          >
                            Delete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="roles">
          <RolesManagement roles={roles} setRoles={setRoles} />
        </TabsContent>
      </Tabs>

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          onSave={handleUpdateUser}
          onCancel={() => setEditingUser(null)}
          isAdmin={isAdmin}
        />
      )}

      {deletingUser && (
        <DeleteUserDialog
          user={deletingUser}
          onDelete={handleDeleteUser}
          onCancel={() => setDeletingUser(null)}
        />
      )}
    </div>
  );
}

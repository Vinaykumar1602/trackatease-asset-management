
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Download, 
  Upload, 
  Plus, 
  Search,
  Filter,
  UserPlus,
  ShieldCheck
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
import { User } from "./types";
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

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { user: authUser, isAdmin } = useAuth();
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authUser) {
      fetchUsers();
    }
  }, [authUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      if (!isAdmin) {
        // If not admin, only load the current user
        if (authUser) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();
          
          if (profileError) throw profileError;
          
          if (profileData) {
            const userData: User = {
              id: profileData.id,
              name: profileData.name || authUser.email?.split('@')[0] || "User",
              email: profileData.email || authUser.email || "",
              role: profileData.role || "User",
              department: profileData.department || "General",
              status: "Active",
              lastLogin: "Now",
              permissions: []
            };
            
            setUsers([userData]);
          }
        }
      } else {
        // Admin can see all users
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
          
        if (profilesError) throw profilesError;
        
        if (profilesData) {
          const formattedUsers = profilesData.map(profile => ({
            id: profile.id,
            name: profile.name || profile.email?.split('@')[0] || "User",
            email: profile.email || "",
            role: profile.role || "User",
            department: profile.department || "General",
            status: "Active", // Could be fetched from another table if needed
            lastLogin: profile.updated_at ? new Date(profile.updated_at).toLocaleString() : "Never",
            permissions: [] // Could be fetched from a permissions table if implemented
          }));
          
          setUsers(formattedUsers);
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
      
      // In a real app, you would typically invite the user through auth system
      // For now, we'll just add their profile
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          email: userData.email,
          name: userData.name,
          role: userData.role,
          department: userData.department
        })
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        const newUser: User = {
          ...userData,
          id: data[0].id,
          lastLogin: "Never"
        };
        
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
      if (!isAdmin && updatedUser.id !== authUser?.id) {
        toast({
          title: "Permission Denied",
          description: "You can only edit your own profile",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updatedUser.name,
          role: updatedUser.role,
          department: updatedUser.department,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedUser.id);
      
      if (error) throw error;
      
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
            role: values[3] || "User",
            department: values[4] || "General",
          };
        });
        
        const validUsers = importedUsers.filter(user => user.name && user.email);
        
        if (validUsers.length > 0) {
          const { data, error } = await supabase
            .from('profiles')
            .insert(validUsers.map(user => ({
              email: user.email,
              name: user.name,
              role: user.role,
              department: user.department
            })))
            .select();
          
          if (error) throw error;
          
          if (data) {
            const newUsers = data.map(item => ({
              id: item.id,
              name: item.name,
              email: item.email,
              role: item.role,
              department: item.department,
              status: "Active",
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
      
      // In a real implementation, this might involve more steps
      // such as deleting the actual auth user, but for now we just remove the profile
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
      
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    
    const matchesStatus = statusFilter === "All" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users & Roles</h1>
          <p className="text-muted-foreground">Manage user accounts and assign roles.</p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button variant="outline" size="sm">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Roles
            </Button>
          )}
          {isAdmin && <AddUserDialog onSave={handleAddUser} />}
        </div>
      </div>

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
          {isAdmin && (
            <>
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
            </>
          )}
          {isAdmin && (
            <>
              <Select
                value={roleFilter}
                onValueChange={setRoleFilter}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Auditor">Auditor</SelectItem>
                  <SelectItem value="Technician">Technician</SelectItem>
                  <SelectItem value="Inventory Manager">Inventory Manager</SelectItem>
                  <SelectItem value="User">User</SelectItem>
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
            </>
          )}
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
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No users found. {isAdmin && "Add a new user or adjust your filters."}
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
                    <Badge variant={user.role === "Admin" ? "default" : "outline"}>
                      {user.role === "Admin" && <ShieldCheck className="h-3 w-3 mr-1" />}
                      {user.role}
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
                    {isAdmin && user.email !== authUser?.email && (
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
          onDelete={() => handleDeleteUser(deletingUser.id)}
          onCancel={() => setDeletingUser(null)}
        />
      )}
    </div>
  );
}

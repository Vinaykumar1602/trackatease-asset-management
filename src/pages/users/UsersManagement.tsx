
import { useState, useRef, useEffect } from "react";
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
  const [users, setUsers] = useState<User[]>([
    { 
      id: 1, 
      name: "John Smith", 
      email: "john.smith@trackatease.com", 
      role: "Admin", 
      department: "IT",
      status: "Active",
      lastLogin: "Today, 9:32 AM",
      permissions: ["View Assets", "Edit Assets", "Delete Assets", "View Sales", "Manage Sales", "View Service", "Manage Service", "Generate Reports", "Manage Users"]
    },
    { 
      id: 2, 
      name: "Jane Doe", 
      email: "jane.doe@trackatease.com", 
      role: "Auditor", 
      department: "Finance",
      status: "Active",
      lastLogin: "Yesterday, 4:15 PM",
      permissions: ["View Assets", "View Sales", "View Service", "Generate Reports"]
    },
    { 
      id: 3, 
      name: "Mike Johnson", 
      email: "mike.johnson@trackatease.com", 
      role: "Technician", 
      department: "Service",
      status: "Active",
      lastLogin: "Jul 10, 10:28 AM",
      permissions: ["View Assets", "View Service", "Manage Service"]
    },
    { 
      id: 4, 
      name: "Sarah Wilson", 
      email: "sarah.wilson@trackatease.com", 
      role: "Technician", 
      department: "Service",
      status: "Active",
      lastLogin: "Jul 09, 2:47 PM",
      permissions: ["View Assets", "View Service", "Manage Service"]
    },
    { 
      id: 5, 
      name: "David Brown", 
      email: "david.brown@trackatease.com", 
      role: "Inventory Manager", 
      department: "Warehouse",
      status: "Inactive",
      lastLogin: "Jun 22, 11:05 AM",
      permissions: ["View Assets", "Edit Assets", "View Sales"]
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { user: authUser, isAdmin } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load the authenticated user info
  useEffect(() => {
    const loadAdminUser = async () => {
      if (!authUser) return;

      try {
        // Check if user exists in the list
        const existingUser = users.find(u => u.email === authUser.email);
        
        if (!existingUser) {
          // Add the current authenticated user to the list if they're not there
          const adminUser: User = {
            id: parseInt(authUser.id.substring(0, 8), 16) || 999, // Convert part of UUID to number for ID
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || "Admin User",
            email: authUser.email || "",
            role: "Admin",
            department: "IT",
            status: "Active",
            lastLogin: "Now",
            permissions: ["View Assets", "Edit Assets", "Delete Assets", "View Sales", "Manage Sales", "View Service", "Manage Service", "Generate Reports", "Manage Users"]
          };
          
          setUsers(prev => [adminUser, ...prev]);
          
          toast({
            title: "Admin User Added",
            description: `${authUser.email} has been added as an admin user.`
          });
        }
        
        console.log("Admin user loaded:", authUser.email);
        
      } catch (error) {
        console.error("Error loading admin user:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAdminUser();
  }, [authUser, toast]);

  const handleAddUser = (userData: Omit<User, "id" | "lastLogin">) => {
    const id = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
    const currentDate = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(currentDate);
    
    const newUser: User = {
      ...userData,
      id,
      lastLogin: "Never"
    };
    
    setUsers([...users, newUser]);
    
    toast({
      title: "User Added",
      description: `${newUser.name} has been added to the system.`
    });
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    setEditingUser(null);
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
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim());
        
        const importedUsers = rows.slice(1).map(row => {
          const values = row.split(',');
          return {
            id: users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1,
            name: values[1] || "",
            email: values[2] || "",
            role: values[3] || "User",
            department: values[4] || "General",
            status: values[5] || "Active",
            lastLogin: "Never",
            permissions: []
          };
        });
        
        const validUsers = importedUsers.filter(user => user.name && user.email);
        
        setUsers(prev => [...prev, ...validUsers]);
        
        toast({
          title: "Import Successful",
          description: `${validUsers.length} users have been imported.`
        });
      } catch (error) {
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

  const handleDeleteUser = (userId: number) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    setDeletingUser(null);
    
    toast({
      title: "User Deleted",
      description: "The user has been permanently deleted."
    });
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
          <Button variant="outline" size="sm">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Roles
          </Button>
          <AddUserDialog onSave={handleAddUser} />
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
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setDeletingUser(user)}
                      className="text-destructive hover:text-destructive"
                      disabled={authUser && user.email === authUser.email} // Prevent deleting yourself
                    >
                      Delete
                    </Button>
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

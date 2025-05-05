
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, AlertCircle, Search, Filter, RefreshCw, Download, Upload, Plus, UserPlus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { User, sampleUsers, Role, sampleRoles } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RolesManagement from "./components/RolesManagement";
import { supabase } from "@/integrations/supabase/client";
import { initializeAllDemoData } from "@/utils/demoData";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [roles, setRoles] = useState<Role[]>(sampleRoles);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInitializingData, setIsInitializingData] = useState(false);

  const { user: authUser } = useAuth();
  const { toast } = useToast();

  const syncUserRoles = async () => {
    try {
      setIsSyncing(true);
      toast({
        title: "Syncing",
        description: "Syncing user roles and permissions...",
      });
      
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">View user accounts and roles.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={syncUserRoles}
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
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Users className="h-4 w-4 mr-2" />
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">Loading users...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
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
    </div>
  );
}


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

export default function UsersManagement() {
  // Placeholder data for users
  const users = [
    { 
      id: 1, 
      name: "John Smith", 
      email: "john.smith@company.com", 
      role: "Admin", 
      department: "IT",
      status: "Active",
      lastLogin: "Today, 9:32 AM"
    },
    { 
      id: 2, 
      name: "Jane Doe", 
      email: "jane.doe@company.com", 
      role: "Auditor", 
      department: "Finance",
      status: "Active",
      lastLogin: "Yesterday, 4:15 PM"
    },
    { 
      id: 3, 
      name: "Mike Johnson", 
      email: "mike.johnson@company.com", 
      role: "Technician", 
      department: "Service",
      status: "Active",
      lastLogin: "Jul 10, 10:28 AM"
    },
    { 
      id: 4, 
      name: "Sarah Wilson", 
      email: "sarah.wilson@company.com", 
      role: "Technician", 
      department: "Service",
      status: "Active",
      lastLogin: "Jul 09, 2:47 PM"
    },
    { 
      id: 5, 
      name: "David Brown", 
      email: "david.brown@company.com", 
      role: "Inventory Manager", 
      department: "Warehouse",
      status: "Inactive",
      lastLogin: "Jun 22, 11:05 AM"
    }
  ];

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
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            New User
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search users..." className="pl-8 w-full" />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            Role: All
          </Button>
          <Button variant="outline" size="sm">
            Status: All
          </Button>
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
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "Admin" ? "default" : "outline"}>
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
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">Permissions</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

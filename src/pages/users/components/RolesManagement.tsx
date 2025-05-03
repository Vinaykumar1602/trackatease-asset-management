import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Role, sampleRoles, permissionModules } from "../types";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  ShieldCheck, 
  Users, 
  Lock, 
  Check, 
  X,
  Plus,
  Settings,
  Edit
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Permission } from '../types';
import { Info } from 'lucide-react';

interface RolesManagementProps {
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

export default function RolesManagement({ roles, setRoles }: RolesManagementProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
  };

  const handleAddRole = () => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only administrators can add new roles",
        variant: "destructive"
      });
      return;
    }
    setIsAddingRole(true);
  };

  const saveRole = (roleData: Role) => {
    if (selectedRole) {
      // Update existing role
      setRoles(prevRoles => prevRoles.map(r => 
        r.id === roleData.id ? roleData : r
      ));
      
      toast({
        title: "Role Updated",
        description: `The ${roleData.name} role has been updated.`
      });
    } else if (isAddingRole) {
      // Add new role
      const newRole: Role = {
        ...roleData,
        id: crypto.randomUUID(),
        userCount: 0
      };
      
      setRoles(prevRoles => [...prevRoles, newRole]);
      
      toast({
        title: "Role Added",
        description: `The ${newRole.name} role has been added.`
      });
    }
    
    setSelectedRole(null);
    setIsAddingRole(false);
  };

  const handleRoleDelete = (roleId: string) => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only administrators can delete roles",
        variant: "destructive"
      });
      return;
    }

    const roleToDelete = roles.find(r => r.id === roleId);
    
    if (!roleToDelete) return;
    
    if (['admin', 'user'].includes(String(roleToDelete.name))) {
      toast({
        title: "Cannot Delete Core Role",
        description: "The Admin and User roles cannot be deleted as they are core system roles.",
        variant: "destructive"
      });
      return;
    }
    
    if (roleToDelete.userCount > 0) {
      toast({
        title: "Role In Use",
        description: `This role is assigned to ${roleToDelete.userCount} users. Please reassign these users before deleting.`,
        variant: "destructive"
      });
      return;
    }
    
    setRoles(prevRoles => prevRoles.filter(r => r.id !== roleId));
    
    toast({
      title: "Role Deleted",
      description: `The ${roleToDelete.name} role has been deleted.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Roles & Permissions</h2>
          <p className="text-muted-foreground">Manage system roles and their associated permissions.</p>
        </div>
        <Button onClick={handleAddRole}>
          <Plus className="h-4 w-4 mr-2" />
          Add Role
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>System Roles</CardTitle>
          <CardDescription>
            Define what capabilities users have within the system.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Users</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className={`h-4 w-4 ${role.name === 'admin' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="font-medium">
                        {String(role.name).charAt(0).toUpperCase() + String(role.name).slice(1).replace('_', ' ')}
                      </span>
                      {role.name === 'admin' && (
                        <Badge variant="default" className="ml-1">Super User</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {role.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permission) => (
                        <Badge key={permission.id} variant="outline" className="mr-1">
                          {permission.name}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline">+{role.permissions.length - 3}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      <Users className="h-3 w-3 mr-1" />
                      {role.userCount}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mr-2"
                      onClick={() => handleEditRole(role)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {!['admin', 'user'].includes(String(role.name)) && role.userCount === 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleRoleDelete(role.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {(selectedRole || isAddingRole) && (
        <RoleEditDialog
          role={selectedRole}
          open={!!selectedRole || isAddingRole}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedRole(null);
              setIsAddingRole(false);
            }
          }}
          onSave={saveRole}
          isAdd={isAddingRole}
        />
      )}
    </div>
  );
}

interface RoleEditDialogProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (role: Role) => void;
  isAdd: boolean;
}

function RoleEditDialog({ role, open, onOpenChange, onSave, isAdd }: RoleEditDialogProps) {
  const [roleName, setRoleName] = useState(role?.name || '');
  const [description, setDescription] = useState(role?.description || '');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role ? role.permissions.map(p => p.id) : []
  );
  
  const { toast } = useToast();

  const handleSave = () => {
    if (!roleName) {
      toast({
        title: "Validation Error",
        description: "Role name is required",
        variant: "destructive"
      });
      return;
    }
    
    // Get all permissions from all modules
    const allPermissions = permissionModules.flatMap(m => m.permissions);
    
    // Filter to only the selected permissions
    const permissions = allPermissions.filter(p => selectedPermissions.includes(p.id)) as Permission[];
    
    const updatedRole: Role = {
      id: role?.id || crypto.randomUUID(),
      name: roleName,
      description,
      permissions,
      userCount: role?.userCount || 0,
      createdAt: role?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onSave(updatedRole);
  };
  
  const togglePermission = (id: string) => {
    if (selectedPermissions.includes(id)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== id));
    } else {
      setSelectedPermissions([...selectedPermissions, id]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isAdd ? "Add Role" : "Edit Role"}</DialogTitle>
          <DialogDescription>
            {isAdd 
              ? "Create a new role and define its permissions." 
              : "Modify this role and its permissions."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role-name" className="text-right">
              Role Name
            </Label>
            <Input
              id="role-name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Department Manager"
              disabled={role && ['admin', 'user'].includes(String(role.name))}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role-description" className="text-right">
              Description
            </Label>
            <Textarea
              id="role-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Describe what this role is responsible for"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-4 pt-4">
            <Label className="text-right pt-0">
              Permissions
            </Label>
            <div className="col-span-3">
              <ScrollArea className="h-[300px] border rounded-md p-4">
                <div className="space-y-6">
                  {permissionModules.map((module) => (
                    <div key={module.name} className="space-y-2">
                      <h4 className="font-medium border-b pb-1">{module.name} Permissions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {module.permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`permission-${permission.id}`}
                              checked={selectedPermissions.includes(permission.id)}
                              onCheckedChange={() => togglePermission(permission.id)}
                              disabled={role && ['admin'].includes(String(role.name))}
                            />
                            <Label htmlFor={`permission-${permission.id}`} className="flex-1 flex items-center gap-2">
                              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{permission.description}</span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="mt-2 text-xs text-muted-foreground">
                {role && ['admin'].includes(String(role.name)) ? (
                  <div className="flex items-center text-amber-600">
                    <Info className="h-3.5 w-3.5 mr-1" />
                    Admin role automatically has all permissions
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isAdd ? "Create Role" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper component for info icon
function Info(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

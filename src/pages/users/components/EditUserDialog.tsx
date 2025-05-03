import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "../types";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

interface EditUserDialogProps {
  user: User;
  onSave: (user: User & { password?: string }) => void;  // Updated the type to include optional password
  onCancel: () => void;
  isAdmin?: boolean; // Added isAdmin as optional prop
}

export function EditUserDialog({ user, onSave, onCancel, isAdmin = false }: EditUserDialogProps) {
  const [formData, setFormData] = useState<User & { password?: string }>({ ...user });  // Updated type
  const [resetPassword, setResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const { toast } = useToast();

  // Available permissions
  const availablePermissions = [
    { id: 1, name: "View Assets", module: "Assets" },
    { id: 2, name: "Create Assets", module: "Assets" },
    { id: 3, name: "Edit Assets", module: "Assets" },
    { id: 4, name: "Delete Assets", module: "Assets" },
    { id: 5, name: "View Sales", module: "Sales" },
    { id: 6, name: "Manage Sales", module: "Sales" },
    { id: 7, name: "View Service", module: "Service" },
    { id: 8, name: "Manage Service", module: "Service" },
    { id: 9, name: "Generate Reports", module: "Reports" },
    { id: 10, name: "Manage Users", module: "Users" },
  ];

  // Initialize permissions
  useEffect(() => {
    if (!formData.permissions) {
      // Default permissions based on role
      if (formData.role === "Admin") {
        setFormData(prev => ({
          ...prev,
          permissions: availablePermissions.map(p => p.name)
        }));
      } else if (formData.role === "Auditor") {
        setFormData(prev => ({
          ...prev,
          permissions: ["View Assets", "View Sales", "View Service", "Generate Reports"]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          permissions: []
        }));
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => {
      const currentPermissions = prev.permissions || [];
      
      if (checked) {
        return {
          ...prev,
          permissions: [...currentPermissions, permission]
        };
      } else {
        return {
          ...prev,
          permissions: currentPermissions.filter(p => p !== permission)
        };
      }
    });
  };

  const handleSubmit = () => {
    // Validate fields
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // If resetting password, validate new password
    if (resetPassword && (!newPassword || newPassword.length < 6)) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    // Update password if requested
    const updatedUser = { ...formData };
    if (resetPassword) {
      updatedUser.password = newPassword;
    }

    onSave(updatedUser);
    toast({
      title: "User Updated",
      description: `${updatedUser.name}'s information has been updated.`
    });
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and permissions
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">User Details</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Full Name
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Auditor">Auditor</SelectItem>
                  <SelectItem value="Technician">Technician</SelectItem>
                  <SelectItem value="Inventory Manager">Inventory Manager</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-department" className="text-right">
                Department
              </Label>
              <Select
                value={formData.department}
                onValueChange={(value) => handleSelectChange("department", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Service">Service</SelectItem>
                  <SelectItem value="Warehouse">Warehouse</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right col-span-1">
                <Label htmlFor="reset-password" className="cursor-pointer">
                  Reset Password
                </Label>
              </div>
              <div className="col-span-3 flex items-center gap-4">
                <Checkbox 
                  id="reset-password" 
                  checked={resetPassword}
                  onCheckedChange={(checked) => setResetPassword(checked === true)}
                />
                {resetPassword && (
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex-1"
                  />
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="permissions" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {availablePermissions.map((permission) => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`perm-${permission.id}`}
                    checked={(formData.permissions || []).includes(permission.name)}
                    onCheckedChange={(checked) => 
                      handlePermissionChange(permission.name, checked === true)
                    }
                  />
                  <Label 
                    htmlFor={`perm-${permission.id}`}
                    className="cursor-pointer"
                  >
                    {permission.name}
                    <span className="text-xs text-muted-foreground block">
                      Module: {permission.module}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


import { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];

export interface User {
  id: string;
  name: string;
  email: string;
  role: AppRole | string;
  department: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastLogin: string;
  permissions?: string[];
  phoneNumber?: string;
  profileImage?: string;
  dateJoined?: string;
  twoFactorEnabled?: boolean;
}

export interface Role {
  id: string;
  name: AppRole | string;
  description: string;
  permissions: Permission[];
  userCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Permission {
  id: string;
  name: string;
  module: string;
  description: string;
  isActive?: boolean;
}

// Sample dummy data for users
export const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@example.com',
    role: 'admin',
    department: 'Management',
    status: 'Active',
    lastLogin: new Date().toISOString(),
    dateJoined: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    name: 'Alice Technician',
    email: 'alice@example.com',
    role: 'technician',
    department: 'Service',
    status: 'Active',
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    dateJoined: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    name: 'Bob Auditor',
    email: 'bob@example.com',
    role: 'auditor',
    department: 'Finance',
    status: 'Active',
    lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    dateJoined: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    name: 'Carol Manager',
    email: 'carol@example.com',
    role: 'inventory_manager',
    department: 'Warehouse',
    status: 'Active',
    lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    dateJoined: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    name: 'David User',
    email: 'david@example.com',
    role: 'user',
    department: 'Sales',
    status: 'Inactive',
    lastLogin: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    dateJoined: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Sample roles with permissions
export const sampleRoles: Role[] = [
  {
    id: '1',
    name: 'admin',
    description: 'Full system access with all permissions',
    permissions: [
      { id: '1', name: 'create_user', module: 'Users', description: 'Can create users' },
      { id: '2', name: 'edit_user', module: 'Users', description: 'Can edit users' },
      { id: '3', name: 'delete_user', module: 'Users', description: 'Can delete users' },
      { id: '4', name: 'manage_roles', module: 'Users', description: 'Can manage roles' },
      { id: '5', name: 'access_all', module: 'System', description: 'Can access all areas' }
    ],
    userCount: 1
  },
  {
    id: '2',
    name: 'technician',
    description: 'Service technicians with field service access',
    permissions: [
      { id: '6', name: 'view_service', module: 'Service', description: 'Can view service tickets' },
      { id: '7', name: 'edit_service', module: 'Service', description: 'Can edit service tickets' },
      { id: '8', name: 'create_service', module: 'Service', description: 'Can create service tickets' }
    ],
    userCount: 5
  },
  {
    id: '3',
    name: 'auditor',
    description: 'Read-only access to financial and inventory data',
    permissions: [
      { id: '9', name: 'view_reports', module: 'Reports', description: 'Can view reports' },
      { id: '10', name: 'export_data', module: 'Reports', description: 'Can export data' },
      { id: '11', name: 'view_inventory', module: 'Inventory', description: 'Can view inventory' }
    ],
    userCount: 2
  },
  {
    id: '4',
    name: 'inventory_manager',
    description: 'Manages inventory and assets',
    permissions: [
      { id: '12', name: 'view_inventory', module: 'Inventory', description: 'Can view inventory' },
      { id: '13', name: 'edit_inventory', module: 'Inventory', description: 'Can edit inventory' },
      { id: '14', name: 'manage_assets', module: 'Assets', description: 'Can manage assets' }
    ],
    userCount: 3
  },
  {
    id: '5',
    name: 'user',
    description: 'Basic user with limited access',
    permissions: [
      { id: '15', name: 'view_dashboard', module: 'Dashboard', description: 'Can view dashboard' },
      { id: '16', name: 'view_profile', module: 'Profile', description: 'Can view own profile' },
      { id: '17', name: 'edit_profile', module: 'Profile', description: 'Can edit own profile' }
    ],
    userCount: 10
  }
];

// Permission module groups for role management
export const permissionModules = [
  {
    name: 'Users',
    permissions: [
      { id: '1', name: 'create_user', description: 'Can create users' },
      { id: '2', name: 'edit_user', description: 'Can edit users' },
      { id: '3', name: 'delete_user', description: 'Can delete users' },
      { id: '4', name: 'manage_roles', description: 'Can manage roles' }
    ]
  },
  {
    name: 'System',
    permissions: [
      { id: '5', name: 'access_all', description: 'Can access all areas' },
      { id: '18', name: 'manage_settings', description: 'Can manage system settings' },
      { id: '19', name: 'view_logs', description: 'Can view system logs' }
    ]
  },
  {
    name: 'Service',
    permissions: [
      { id: '6', name: 'view_service', description: 'Can view service tickets' },
      { id: '7', name: 'edit_service', description: 'Can edit service tickets' },
      { id: '8', name: 'create_service', description: 'Can create service tickets' }
    ]
  },
  {
    name: 'Reports',
    permissions: [
      { id: '9', name: 'view_reports', description: 'Can view reports' },
      { id: '10', name: 'export_data', description: 'Can export data' }
    ]
  },
  {
    name: 'Inventory',
    permissions: [
      { id: '11', name: 'view_inventory', description: 'Can view inventory' },
      { id: '13', name: 'edit_inventory', description: 'Can edit inventory' }
    ]
  },
  {
    name: 'Assets',
    permissions: [
      { id: '14', name: 'manage_assets', description: 'Can manage assets' }
    ]
  }
];

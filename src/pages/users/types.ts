
export interface User {
  id: string; // Changed from number to string to match Supabase's UUID format
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  lastLogin: string;
  permissions?: string[];
  password?: string;
  phoneNumber?: string;
  profileImage?: string;
  dateJoined?: string;
  twoFactorEnabled?: boolean;
}

export interface Role {
  id: string; // Changed from number to string
  name: string;
  permissions: Permission[];
  userCount: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Permission {
  id: string; // Changed from number to string
  name: string;
  module: string;
  description: string;
  isActive?: boolean;
}

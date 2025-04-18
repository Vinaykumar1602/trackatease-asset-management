
export interface User {
  id: number;
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
  id: number;
  name: string;
  permissions: Permission[];
  userCount: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Permission {
  id: number;
  name: string;
  module: string;
  description: string;
  isActive?: boolean;
}

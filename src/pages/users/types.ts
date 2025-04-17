
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
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
  userCount: number;
}

export interface Permission {
  id: number;
  name: string;
  module: string;
  description: string;
}

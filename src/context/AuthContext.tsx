
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Auditor' | 'Technician' | 'Inventory Manager';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Mock users for demonstration
  const mockUsers = [
    { id: '1', name: 'Admin User', email: 'admin@trackatease.com', password: 'admin123', role: 'Admin' as const },
    { id: '2', name: 'John Smith', email: 'john@trackatease.com', password: 'john123', role: 'Technician' as const },
    { id: '3', name: 'Jane Doe', email: 'jane@trackatease.com', password: 'jane123', role: 'Auditor' as const }
  ];

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('trackatease_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in a real app, this would call an API
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (!foundUser) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
      return false;
    }

    // Create a user object without the password
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('trackatease_user', JSON.stringify(userWithoutPassword));
    
    toast({
      title: "Login Successful",
      description: `Welcome back, ${userWithoutPassword.name}!`,
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trackatease_user');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully"
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

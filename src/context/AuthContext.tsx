
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician' | 'auditor' | 'inventory_manager' | 'user';
  avatar_url?: string;
  department?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
  checkAdminRole: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { toast } = useToast();

  const refreshProfile = async () => {
    try {
      if (!user) return;
      
      console.log('Refreshing profile for user:', user.email);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data) {
        setProfile(data as UserProfile);
        
        // Also check admin role when profile is refreshed
        const isUserAdmin = await checkAdminRole();
        console.log('User admin status after profile refresh:', isUserAdmin);
        setIsAdmin(isUserAdmin);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const checkAdminRole = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      console.log('Checking admin role for user:', user.email);
      
      // First check user_roles table directly
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
        
      console.log('Direct role check result:', roleData, roleError);

      if (!roleError && roleData?.role === 'admin') {
        console.log('Admin role found in user_roles table');
        return true;
      }
        
      // If that fails, try the RPC function
      const { data, error } = await supabase.rpc('is_admin');

      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }

      const adminStatus = !!data;
      console.log('Admin status via RPC:', adminStatus);
      return adminStatus;
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  };

  // Initialize auth state
  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log('Current user:', currentSession.user.email);
          console.log('User ID:', currentSession.user.id);
          
          // We use setTimeout to prevent deadlocks with Supabase client
          setTimeout(() => {
            refreshProfile();
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
      }
    );
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session:', currentSession ? 'exists' : 'none');
      
      if (currentSession?.user) {
        console.log('Current user:', currentSession.user.email);
        console.log('User ID:', currentSession.user.id);
      }
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        refreshProfile();
      }
      
      setLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, message: error.message };
      }

      console.log('Login successful for:', email);
      
      // After successful login, check if user is admin
      if (data.user) {
        setTimeout(async () => {
          const isUserAdmin = await checkAdminRole();
          console.log('User is admin:', isUserAdmin);
          setIsAdmin(isUserAdmin);
        }, 500);
      }

      toast({
        title: "Login Successful",
        description: `Welcome back!`,
      });
      return { success: true, message: "Login successful" };
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return { success: false, message: error.message || "An unexpected error occurred" };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, message: error.message };
      }

      toast({
        title: "Sign Up Successful",
        description: "Your account has been created. Please verify your email.",
      });
      return { success: true, message: "Please verify your email" };
    } catch (error: any) {
      toast({
        title: "Sign Up Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return { success: false, message: error.message || "An unexpected error occurred" };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully"
      });
    } catch (error: any) {
      toast({
        title: "Logout Error",
        description: error.message || "An error occurred during logout",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        login,
        signUp,
        logout,
        isAuthenticated: !!session,
        refreshProfile,
        isAdmin,
        checkAdminRole
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

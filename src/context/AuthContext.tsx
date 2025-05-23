
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AppRole } from '@/pages/users/types';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: AppRole | string;
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
      
      // Get profile data
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
        // Check user_roles table directly
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
          
        const hasAdminRole = roleData?.role === 'admin';
        
        // Set admin status based on either the role field or the user_roles table
        const adminStatus = hasAdminRole || data.role === 'admin';
        console.log('User role from profile:', data.role);
        console.log('User has admin role in user_roles:', hasAdminRole);
        console.log('Final admin status:', adminStatus);
        
        // Update data with admin status if found in user_roles but not in profile
        if (hasAdminRole && data.role !== 'admin') {
          await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', user.id);
            
          data.role = 'admin';
          console.log('Updated profile role to admin');
        }
        
        setProfile(data as UserProfile);
        setIsAdmin(adminStatus);
        console.log('Profile and admin status updated:', data.role, adminStatus);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const checkAdminRole = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      console.log('Checking admin role for user:', user.email);
      
      // First try the RPC function (most reliable)
      const { data: rpcData, error: rpcError } = await supabase.rpc('is_admin');
      
      if (!rpcError && rpcData === true) {
        console.log('Admin role confirmed via RPC');
        setIsAdmin(true);
        return true;
      }
      
      console.log('RPC result:', rpcData, rpcError);

      // Then check user_roles table directly
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
        
      console.log('Direct role check result:', roleData, roleError);

      if (!roleError && roleData?.role === 'admin') {
        console.log('Admin role found in user_roles table');
        
        // Ensure profile also has admin role
        await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', user.id);
          
        if (profile && profile.role !== 'admin') {
          setProfile({...profile, role: 'admin'});
        }
        
        setIsAdmin(true);
        return true;
      }

      // Try the server function directly as a last resort
      const { data: directData, error: directError } = await supabase.rpc('get_admin_status');
      
      if (!directError && directData === true) {
        console.log('Admin status confirmed via direct function call');
        
        // Ensure both tables have consistent data
        if (profile && profile.role !== 'admin') {
          await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', user.id);
            
          setProfile({...profile, role: 'admin'});
        }
        
        // Also ensure the user_roles table has the entry
        const { error: roleInsertError } = await supabase
          .from('user_roles')
          .upsert({ user_id: user.id, role: 'admin' });
          
        if (roleInsertError) {
          console.error('Error upserting admin role:', roleInsertError);
        }
        
        setIsAdmin(true);
        return true;
      }
      
      console.log('User is not an admin');
      setIsAdmin(false);
      return false;
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
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log('Current user:', currentSession.user.email);
          console.log('User ID:', currentSession.user.id);
          
          // We use setTimeout to prevent deadlocks with Supabase client
          setTimeout(async () => {
            await refreshProfile();
            
            // Check admin status specifically after profile is loaded
            const adminStatus = await checkAdminRole();
            console.log('Admin status after auth state change:', adminStatus);
          }, 100);
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
        setTimeout(async () => {
          await refreshProfile();
          
          // Check admin status specifically after profile is loaded
          const adminStatus = await checkAdminRole();
          console.log('Admin status after initial session:', adminStatus);
        }, 100);
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
          await refreshProfile();
          const isUserAdmin = await checkAdminRole();
          console.log('User is admin:', isUserAdmin);
          
          // Refresh the profile again to ensure all data is up to date
          await refreshProfile();
          
          if (isUserAdmin) {
            toast({
              title: "Admin Access",
              description: "You've logged in with administrator privileges.",
            });
          }
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


import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

/**
 * Checks if the current user has admin privileges
 * @returns Promise that resolves to boolean indicating admin status
 */
export const checkAdminStatus = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data, error } = await supabase
      .rpc('has_role', { 
        user_id: user.id, 
        role: 'admin' 
      });
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Creates a new admin user account
 * @param email Email for the new admin
 * @param password Password for the new admin
 * @param name Name for the new admin
 */
export const createAdminUser = async (
  email: string, 
  password: string, 
  name: string = "Administrator"
): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if we're already signed in
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    // Sign up new user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    
    if (error) {
      return { 
        success: false, 
        message: `Failed to create admin user: ${error.message}` 
      };
    }
    
    if (!data.user) {
      return { 
        success: false, 
        message: "User creation failed for unknown reason" 
      };
    }
    
    // Set admin role for the new user
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: data.user.id,
        role: 'admin'
      });
      
    if (roleError) {
      return { 
        success: false, 
        message: `Admin role assignment failed: ${roleError.message}` 
      };
    }
    
    // Update profile to reflect admin role
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', data.user.id);
    
    if (profileError) {
      console.error('Error updating profile role:', profileError);
    }
    
    // If we were signed in before, sign back in
    if (currentUser) {
      await supabase.auth.setSession({
        access_token: currentUser.id,
        refresh_token: '',
      });
    }
    
    return { 
      success: true, 
      message: `Admin user ${email} created successfully` 
    };
  } catch (error: any) {
    return { 
      success: false, 
      message: `Error creating admin: ${error.message}` 
    };
  }
};

export const useAdminTools = () => {
  const { toast } = useToast();
  
  const setupAdminUser = async (email: string, password: string, name: string = "Administrator") => {
    const result = await createAdminUser(email, password, name);
    
    toast({
      title: result.success ? "Success" : "Error",
      description: result.message,
      variant: result.success ? "default" : "destructive"
    });
    
    return result.success;
  };
  
  return { 
    checkAdminStatus,
    setupAdminUser
  };
};


import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

/**
 * Checks if the current user has admin privileges
 * @returns Promise that resolves to boolean indicating admin status
 */
export const checkAdminStatus = async (): Promise<boolean> => {
  try {
    // Use the server-side function to check admin status
    const { data, error } = await supabase.rpc('is_admin');
    
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
    
    // Use our RPC function to promote the user to admin
    const { data: fnData, error: fnError } = await supabase.rpc(
      'promote_user_to_admin', 
      { user_email: email }
    );
    
    if (fnError) {
      return { 
        success: false, 
        message: `Admin role assignment failed: ${fnError.message}` 
      };
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
      message: fnData || `Admin user ${email} created successfully` 
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

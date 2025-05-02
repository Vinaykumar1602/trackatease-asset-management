
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

/**
 * Checks if the current user has admin privileges
 * @returns Promise that resolves to boolean indicating admin status
 */
export const checkAdminStatus = async (): Promise<boolean> => {
  try {
    // First check user_roles table directly for better performance
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('role', 'admin')
      .maybeSingle();
      
    if (!roleError && roleData?.role === 'admin') {
      console.log('Admin role found in direct check');
      return true;
    }
    
    // Use the server-side function to check admin status
    const { data, error } = await supabase.rpc('is_admin');
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    console.log('Admin status via RPC:', !!data);
    return !!data;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Creates a new admin user account or promotes an existing user
 * @param email Email for the admin
 * @param password Password for the admin
 * @param name Name for the admin
 */
export const createAdminUser = async (
  email: string, 
  password: string, 
  name: string = "Administrator"
): Promise<{ success: boolean; message: string }> => {
  try {
    // First check if user already exists in profiles
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .limit(1);
      
    if (existingProfiles && existingProfiles.length > 0) {
      const userId = existingProfiles[0].id;
      console.log('User exists, promoting to admin:', userId);
      
      // Check if user already has admin role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .limit(1);
        
      if (existingRole && existingRole.length > 0) {
        return { 
          success: true, 
          message: `User ${email} is already an admin` 
        };
      }
      
      // Promote existing user to admin
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'admin'
        });
        
      if (insertError) {
        console.error('Error promoting user to admin:', insertError);
        return { 
          success: false, 
          message: `Failed to assign admin role: ${insertError.message}` 
        };
      }
      
      // Update profile role field
      await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userId);
      
      return { 
        success: true, 
        message: `Existing user ${email} promoted to admin successfully` 
      };
    }
    
    // Create new user if doesn't exist
    console.log('Creating new admin user:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          name,
          role: 'admin' 
        }
      }
    });
    
    if (error) {
      return { 
        success: false, 
        message: `Failed to create admin user: ${error.message}` 
      };
    }
    
    if (!data || !data.user) {
      return { 
        success: false, 
        message: "User creation failed for unknown reason" 
      };
    }
    
    console.log('New user created, adding to user_roles table');
    
    // Add admin role directly to user_roles table
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: data.user.id,
        role: 'admin'
      });
      
    if (roleError) {
      console.error('Error adding admin role:', roleError);
      
      // Still return success as the user is created anyway
      return { 
        success: true, 
        message: `Admin user created but role assignment had an error: ${roleError.message}` 
      };
    }
    
    return { 
      success: true, 
      message: `Admin user ${email} created successfully` 
    };
  } catch (error: any) {
    console.error('Error in createAdminUser:', error);
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

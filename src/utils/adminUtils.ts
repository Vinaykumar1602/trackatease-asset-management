
import { supabase } from "@/integrations/supabase/client";

// Check admin status
export const checkAdminStatus = async (): Promise<boolean> => {
  try {
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) {
      return false;
    }
    
    // Use the dedicated RPC function to check admin status
    const { data: isAdmin, error } = await supabase.rpc('is_admin');
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return !!isAdmin;
  } catch (error) {
    console.error('Error in admin check:', error);
    return false;
  }
};

// Create or promote admin user
export const createAdminUser = async (
  email: string, 
  password: string, 
  name: string = "Administrator"
): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if user exists
    const { data, error: userCheckError } = await supabase.auth.admin.listUsers();
    
    if (userCheckError) {
      return { success: false, message: `Error looking up users: ${userCheckError.message}` };
    }
    
    // Properly type the result and check for null/undefined
    const users = data?.users;
    if (!users) {
      return { success: false, message: "Unable to retrieve user list" };
    }
    
    const existingUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      // Use RPC function to promote user to admin
      const { data, error } = await supabase.rpc('promote_user_to_admin', { user_email: email });
      
      if (error) {
        return { success: false, message: `Failed to promote user: ${error.message}` };
      }
      
      return { 
        success: true, 
        message: typeof data === 'string' ? data : `User ${email} promoted to admin successfully`
      };
    }
    
    // Create new admin user
    const { data: userData, error } = await supabase.auth.signUp({
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
      return { success: false, message: `Failed to create user: ${error.message}` };
    }
    
    if (!userData?.user?.id) {
      return { success: false, message: "User creation failed for unknown reason" };
    }
    
    // Use RPC function to promote the new user to admin
    const { error: promoteError } = await supabase.rpc('promote_user_to_admin', { user_email: email });
    
    if (promoteError) {
      return { success: false, message: `User created but failed to assign admin role: ${promoteError.message}` };
    }
    
    return { success: true, message: `Admin user ${email} created successfully` };
  } catch (error: any) {
    return { success: false, message: `Error creating admin: ${error.message}` };
  }
};

// Hook for admin tools
export const useAdminTools = () => {
  return { 
    checkAdminStatus,
    createAdminUser
  };
};

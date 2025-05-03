import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";

// Define type for valid roles
type AppRole = Database["public"]["Enums"]["app_role"];

/**
 * Checks if the current user has admin privileges
 * @returns Promise that resolves to boolean indicating admin status
 */
export const checkAdminStatus = async (): Promise<boolean> => {
  try {
    console.log('Checking admin status...');
    
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) {
      console.log('No active session found');
      return false;
    }
    
    console.log('Checking admin status for user:', session.user.email);
    
    // First check user_roles table directly for better performance
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .maybeSingle();
    
    if (roleData?.role === 'admin') {
      console.log('Admin role found in direct check');
      return true;
    } else {
      console.log('No admin role found in direct check', roleError || 'No data');
    }
    
    // Use the server-side function as a fallback to check admin status
    const { data: rpcData, error: rpcError } = await supabase.rpc('is_admin');
    
    if (rpcError) {
      console.error('Error checking admin status via RPC:', rpcError);
      return false;
    }
    
    // Also check profile as a final fallback
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
      
    const hasAdminRole = !!rpcData || profileData?.role === 'admin';
    
    console.log('Admin status:', hasAdminRole);
    return hasAdminRole;
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
    console.log('Starting createAdminUser process for:', email);
    
    // First check if user already exists in auth system
    const { data: existingUsers, error: userCheckError } = await supabase.auth.admin.listUsers();
    
    if (userCheckError) {
      console.error('Error checking users:', userCheckError);
    }
    
    let existingUser = existingUsers?.users?.find(u => u.email === email.toLowerCase());
    let userId: string | null = existingUser?.id || null;
    
    console.log('Existing user check:', existingUser ? 'Found' : 'Not found');
    
    // Check if user exists in profiles even if not found in auth
    if (!userId) {
      const { data: existingProfiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.toLowerCase())
        .limit(1);
        
      if (existingProfiles && existingProfiles.length > 0) {
        userId = existingProfiles[0].id;
        console.log('Found user in profiles:', userId);
      }
    }
    
    if (userId) {
      console.log('User exists, promoting to admin:', userId);
      
      // Check if user already has admin role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .limit(1);
        
      if (existingRole && existingRole.length > 0) {
        console.log('User already has admin role');
        
        // Ensure profile is also updated
        await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', userId);
          
        return { 
          success: true, 
          message: `User ${email} is already an admin` 
        };
      }
      
      // First, delete any existing user_roles for this user to avoid unique constraint errors
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');
      
      // Promote existing user to admin
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'admin' as AppRole
        });
        
      if (insertError) {
        console.error('Error promoting user to admin:', insertError);
        return { 
          success: false, 
          message: `Failed to assign admin role: ${insertError.message}` 
        };
      }
      
      // Update profile role field
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userId);
        
      if (updateError) {
        console.error('Error updating profile:', updateError);
      } else {
        console.log('Successfully updated profile role to admin');
      }
      
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
      console.error('Error creating user:', error);
      return { 
        success: false, 
        message: `Failed to create admin user: ${error.message}` 
      };
    }
    
    if (!data || !data.user) {
      console.error('No user data returned from signUp');
      return { 
        success: false, 
        message: "User creation failed for unknown reason" 
      };
    }
    
    console.log('New user created with ID:', data.user.id);
    
    // Wait a moment to ensure the profile is created via the trigger
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add admin role directly to user_roles table
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: data.user.id,
        role: 'admin' as AppRole
      });
      
    if (roleError) {
      console.error('Error adding admin role:', roleError);
    } else {
      console.log('Admin role added successfully');
    }
    
    // Update the profile to ensure it has the admin role
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', data.user.id);
      
    if (updateError) {
      console.error('Error updating profile:', updateError);
    } else {
      console.log('Profile updated with admin role');
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

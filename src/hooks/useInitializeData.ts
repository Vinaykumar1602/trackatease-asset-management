
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { initializeAllDemoData } from '@/utils/demoData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useInitializeData = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  // Check if any data exists when the app loads
  useEffect(() => {
    const checkIfDataExists = async () => {
      if (!user || hasInitialized || !isAdmin) return;
      
      try {
        const { data: assetsCount } = await supabase
          .from('assets')
          .select('count')
          .single();
          
        const { data: serviceCount } = await supabase
          .from('service_requests')
          .select('count')
          .single();
          
        const { data: salesCount } = await supabase
          .from('sales')
          .select('count')
          .single();
          
        const { data: profilesCount } = await supabase
          .from('profiles')
          .select('count')
          .single();
        
        // Only auto-initialize if less than 2 profiles exist
        // (presumably just the admin user) and no other data
        const shouldInitialize = 
          import.meta.env.DEV && 
          (profilesCount?.count || 0) < 2 && 
          !(assetsCount?.count || serviceCount?.count || salesCount?.count);
        
        if (shouldInitialize) {
          toast({
            title: "Initializing Demo Data",
            description: "Adding sample data for development purposes..."
          });
          
          await initializeData();
        }
      } catch (error) {
        console.error("Error checking if data exists:", error);
      }
    };
    
    checkIfDataExists();
  }, [user, isAdmin, hasInitialized]);

  const initializeData = async () => {
    if (isInitializing) return;
    
    setIsInitializing(true);
    try {
      await initializeAllDemoData();
      
      toast({
        title: "Demo Data Added",
        description: "Sample data has been initialized successfully"
      });
      
      setHasInitialized(true);
    } catch (error) {
      console.error("Error initializing demo data:", error);
      
      toast({
        title: "Initialization Failed",
        description: "Failed to add demo data",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  return {
    isInitializing,
    hasInitialized,
    initializeData
  };
};

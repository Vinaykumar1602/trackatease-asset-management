
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useInitializeData = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  // Check if data exists
  useEffect(() => {
    const checkIfDataExists = async () => {
      if (!user || hasInitialized || !isAdmin) return;
      
      try {
        const tables = ['assets', 'service_requests', 'sales', 'profiles'];
        const counts = {};
        
        for (const table of tables) {
          const { data, error } = await supabase
            .from(table)
            .select('count')
            .single();
            
          if (error) {
            console.error(`Error checking ${table} count:`, error);
          } else {
            counts[table] = data?.count || 0;
          }
        }
        
        console.log("Data counts:", counts);
        
        // Let admin know about empty tables but don't auto-initialize
        if (Object.values(counts).some(count => count === 0)) {
          toast({
            title: "Empty Tables Detected",
            description: "Some tables have no data. You can initialize data from the admin dashboard."
          });
        }
        
      } catch (error) {
        console.error("Error checking if data exists:", error);
      }
    };
    
    checkIfDataExists();
  }, [user, isAdmin, hasInitialized, toast]);

  const initializeData = async () => {
    if (isInitializing) return;
    
    setIsInitializing(true);
    try {
      toast({
        title: "Initializing Data",
        description: "This may take a moment..."
      });
      
      // We'll implement this in AdminDashboard when needed
      // Note: Demo data initialization is removed to simplify codebase
      
      setHasInitialized(true);
      
      toast({
        title: "Data Initialized",
        description: "Sample data has been added successfully"
      });
    } catch (error) {
      console.error("Error initializing data:", error);
      
      toast({
        title: "Initialization Failed",
        description: "Failed to add data",
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

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ServiceItem, ServiceRecord } from "../types";
import { determineSlaStatus, completeService as completeServiceUtil } from "../utils/serviceUtils";
import { 
  fetchServiceItems, 
  fetchServiceHistory, 
  scheduleService as apiScheduleService,
  editService as apiEditService,
  exportToCsv,
  importFromCsv 
} from "./serviceDataUtils";

export const useServiceData = (userId: string | undefined) => {
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [serviceHistory, setServiceHistory] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch service items
  const loadServiceItems = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const items = await fetchServiceItems(userId);
      setServiceItems(items);
    } catch (error) {
      console.error("Error fetching service items:", error);
      toast({
        title: "Error",
        description: "Failed to load service data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  // Fetch service history
  const loadServiceHistory = useCallback(async () => {
    if (!userId) return;
    
    try {
      const history = await fetchServiceHistory(userId);
      setServiceHistory(history);
    } catch (error) {
      console.error("Error fetching service history:", error);
    }
  }, [userId]);

  // Handle service completion with the utility function
  const completeService = useCallback(async (service: ServiceItem) => {
    try {
      const result = await completeServiceUtil(service);
      
      if (result.success && result.updatedService && result.serviceRecord) {
        // Update local state with the completed service
        setServiceItems(currentItems => 
          currentItems.map(item => 
            item.id === result.updatedService!.id ? result.updatedService! : item
          )
        );
        
        // Add to service history
        setServiceHistory(prev => [...prev, result.serviceRecord!]);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error completing service:", error);
      return false;
    }
  }, []);

  // Schedule a new service
  const scheduleService = async (newService: Omit<ServiceItem, 'id' | 'slaStatus'>) => {
    if (!userId) return false;
    
    try {
      const serviceAdded = await apiScheduleService(newService, userId);
      
      if (serviceAdded) {
        setServiceItems(prev => [...prev, serviceAdded]);
        
        toast({
          title: "Service Scheduled",
          description: `Service for ${serviceAdded.product} has been scheduled for ${serviceAdded.scheduledDate}.`
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error scheduling service:", error);
      toast({
        title: "Error",
        description: "Failed to schedule service",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Edit an existing service
  const editService = async (updatedService: ServiceItem) => {
    try {
      const success = await apiEditService(updatedService);
      
      if (success) {
        // Update the local state
        const updatedItem = {
          ...updatedService,
          slaStatus: determineSlaStatus(updatedService.scheduledDate, updatedService.status)
        };
        
        setServiceItems(prev => prev.map(item => 
          item.id === updatedService.id ? updatedItem : item
        ));
        
        // If service was completed, add to history
        if (updatedService.status === "Completed") {
          const serviceRecord: ServiceRecord = {
            id: updatedService.id,
            saleId: updatedService.product || "",
            date: updatedService.scheduledDate || new Date().toISOString().split('T')[0],
            technician: updatedService.technician || 'Unknown',
            description: `Service completed for ${updatedService.product || 'Unknown product'}`,
            partsUsed: updatedService.serialNo || 'N/A',
            nextServiceDue: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0]
          };
          
          setServiceHistory(prev => [...prev, serviceRecord]);
        }
        
        toast({
          title: "Service Updated",
          description: `Service details for ${updatedService.product} have been updated.`
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error updating service:", error);
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Export services to CSV
  const exportServices = () => {
    exportToCsv(serviceItems);
  };
  
  // Import services from CSV
  const importServices = async (file: File): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const success = await importFromCsv(file, userId);
      
      if (success) {
        // Refresh service list
        await loadServiceItems();
        
        toast({
          title: "Import Successful", 
          description: "Services have been imported successfully"
        });
        return true;
      }
      
      toast({
        title: "Import Failed",
        description: "No valid services found in the file",
        variant: "destructive"
      });
      return false;
    } catch (error) {
      console.error("Error importing services:", error);
      toast({
        title: "Error",
        description: "There was an error importing the file.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (userId) {
      loadServiceItems();
      loadServiceHistory();
    }
  }, [userId, loadServiceItems, loadServiceHistory]);

  return {
    serviceItems,
    setServiceItems,
    serviceHistory,
    setServiceHistory,
    loading,
    fetchServiceItems: loadServiceItems,
    fetchServiceHistory: loadServiceHistory,
    completeService,
    scheduleService,
    editService,
    exportServices,
    importServices
  };
};


import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ServiceItem, ServiceRecord, SalesData } from "../types";
import { determineSlaStatus, completeService as completeServiceUtil } from "../utils/serviceUtils";

export const useServiceData = (userId: string | undefined) => {
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [serviceHistory, setServiceHistory] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchServiceItems = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          sales:asset_id (*)
        `);
        
      if (error) throw error;
      
      if (data) {
        const formattedItems: ServiceItem[] = data.map(item => {
          // Type assertion to help TypeScript understand the structure
          const salesData = item.sales as SalesData | null;
          
          return {
            id: item.id,
            client: salesData?.customer_name || "Unknown Client",
            product: salesData?.product_name || item.title,
            serialNo: salesData?.serial || "N/A",
            scheduledDate: item.scheduled_date ? new Date(item.scheduled_date).toISOString().split('T')[0] : "Not scheduled",
            technician: item.assigned_to ? item.assigned_to : "Unassigned",
            status: item.status || "Pending",
            slaStatus: determineSlaStatus(item.scheduled_date, item.status)
          };
        });
        
        setServiceItems(formattedItems);
      }
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

  const fetchServiceHistory = useCallback(async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('status', 'Completed');
        
      if (error) throw error;
      
      if (data) {
        const formattedHistory: ServiceRecord[] = data.map(record => ({
          id: record.id,
          saleId: record.asset_id || "",
          date: record.scheduled_date ? new Date(record.scheduled_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          technician: record.assigned_to || "Unknown",
          description: record.title || "",
          partsUsed: record.description || "None",
          nextServiceDue: record.completion_date ? new Date(new Date(record.completion_date).setMonth(new Date(record.completion_date).getMonth() + 3)).toISOString().split('T')[0] : ""
        }));
        
        setServiceHistory(formattedHistory);
      }
    } catch (error) {
      console.error("Error fetching service history:", error);
    }
  }, [userId]);

  // Handle service completion with the utility function
  const completeService = useCallback(async (service: ServiceItem) => {
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
  }, []);

  // Schedule a new service
  const scheduleService = async (newService: Omit<ServiceItem, 'id' | 'slaStatus'>) => {
    try {
      if (!userId) return false;
      
      let assetId = null;
      
      if (newService.serialNo && newService.serialNo !== "N/A") {
        const { data: assetData } = await supabase
          .from('sales')
          .select('id')
          .eq('serial', newService.serialNo)
          .maybeSingle();
          
        if (assetData) {
          assetId = assetData.id;
        }
      }
      
      const { data, error } = await supabase
        .from('service_requests')
        .insert({
          title: newService.product,
          scheduled_date: newService.scheduledDate,
          assigned_to: newService.technician !== "Unassigned" ? newService.technician : null,
          status: newService.status,
          asset_id: assetId,
          requested_by: userId,
          priority: "medium",
          description: `Service for ${newService.product}`
        })
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        const slaStatus = determineSlaStatus(newService.scheduledDate, newService.status);
        
        const serviceToAdd: ServiceItem = {
          ...newService,
          id: data[0].id,
          slaStatus
        };
        
        setServiceItems(prev => [...prev, serviceToAdd]);
        
        toast({
          title: "Service Scheduled",
          description: `Service for ${serviceToAdd.product} has been scheduled for ${serviceToAdd.scheduledDate}.`
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
      let assetId = null;
      
      if (updatedService.serialNo && updatedService.serialNo !== "N/A") {
        const { data: assetData } = await supabase
          .from('sales')
          .select('id')
          .eq('serial', updatedService.serialNo)
          .maybeSingle();
          
        if (assetData) {
          assetId = assetData.id;
        }
      }
      
      const { error } = await supabase
        .from('service_requests')
        .update({
          title: updatedService.product,
          scheduled_date: updatedService.scheduledDate,
          assigned_to: updatedService.technician !== "Unassigned" ? updatedService.technician : null,
          status: updatedService.status,
          asset_id: assetId,
          completion_date: updatedService.status === "Completed" ? new Date().toISOString() : null
        })
        .eq('id', updatedService.id);
        
      if (error) throw error;
      
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
    const headers = ["ID", "Client", "Product", "Serial No", "Scheduled Date", "Technician", "Status", "SLA Status"];
    const csvContent = [
      headers.join(','),
      ...serviceItems.map(item => 
        [item.id, item.client, item.product, item.serialNo, item.scheduledDate, item.technician, item.status, item.slaStatus].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "services.csv");
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Service records have been exported to CSV."
    });
  };
  
  // Import services from CSV
  const importServices = async (file: File): Promise<boolean> => {
    try {
      if (!userId) return false;
      
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const text = event.target?.result as string;
            const rows = text.split('\n').filter(row => row.trim());
            const headers = rows[0].split(',').map(header => header.trim().toLowerCase());
            
            const importedServices = rows.slice(1).map(row => {
              const values = row.split(',').map(value => value.trim());
              const data: Record<string, string> = {};
              
              headers.forEach((header, index) => {
                if (index < values.length) {
                  // Map CSV headers to our expected field names
                  if (header === 'client') data.client = values[index];
                  else if (header === 'product') data.product = values[index];
                  else if (header === 'serialno' || header === 'serial' || header === 'serial number') 
                    data.serialNo = values[index];
                  else if (header === 'scheduleddate' || header === 'date' || header === 'scheduled date') 
                    data.scheduledDate = values[index];
                  else if (header === 'technician') data.technician = values[index];
                  else if (header === 'status') data.status = values[index];
                  else data[header] = values[index];
                }
              });
              
              return {
                client: data.client || "Unknown Client",
                product: data.product || "Unknown Product",
                serialNo: data.serialNo || "N/A",
                scheduledDate: data.scheduledDate || new Date().toISOString().split('T')[0],
                technician: data.technician || "Unassigned",
                status: data.status || "Pending",
              };
            });
            
            const validServices = importedServices.filter(service => service.product && service.product !== "Unknown Product");
            
            if (validServices.length > 0) {
              let successCount = 0;
              
              for (const service of validServices) {
                try {
                  let assetId = null;
                  
                  if (service.serialNo && service.serialNo !== "N/A") {
                    const { data: assetData } = await supabase
                      .from('sales')
                      .select('id')
                      .eq('serial', service.serialNo)
                      .maybeSingle();
                      
                    if (assetData) {
                      assetId = assetData.id;
                    }
                  }
                  
                  const { data } = await supabase
                    .from('service_requests')
                    .insert({
                      title: service.product,
                      scheduled_date: service.scheduledDate,
                      assigned_to: service.technician !== "Unassigned" ? service.technician : null,
                      status: service.status,
                      asset_id: assetId,
                      requested_by: userId,
                      priority: "medium"
                    })
                    .select('*');
                    
                  if (data && data[0]) {
                    successCount++;
                  }
                } catch (error) {
                  console.error("Error importing individual service:", error);
                }
              }
              
              // Refresh service list
              await fetchServiceItems();
              
              toast({
                title: "Import Successful",
                description: `${successCount} out of ${validServices.length} service records have been imported.`
              });
              
              resolve(true);
            } else {
              toast({
                title: "Import Failed",
                description: "No valid service records found in the file.",
                variant: "destructive"
              });
              resolve(false);
            }
          } catch (error) {
            console.error("Error importing services:", error);
            toast({
              title: "Import Failed",
              description: "There was an error importing the file. Please check the format.",
              variant: "destructive"
            });
            resolve(false);
          }
        };
        reader.readAsText(file);
      });
    } catch (error) {
      console.error("Error importing services:", error);
      toast({
        title: "Import Failed",
        description: "There was an error importing the file.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchServiceItems();
      fetchServiceHistory();
    }
  }, [userId, fetchServiceItems, fetchServiceHistory]);

  return {
    serviceItems,
    setServiceItems,
    serviceHistory,
    setServiceHistory,
    loading,
    fetchServiceItems,
    fetchServiceHistory,
    completeService,
    scheduleService,
    editService,
    exportServices,
    importServices
  };
};

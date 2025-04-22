
import { supabase } from "@/integrations/supabase/client";
import { ServiceItem, ServiceRecord } from "../types";

export const determineSlaStatus = (scheduledDate: string, status: string): string => {
  if (!scheduledDate || status === "Completed") return "Met";
  
  const scheduled = new Date(scheduledDate);
  const today = new Date();
  
  if (status === "Overdue" || (scheduled < today && status !== "Completed")) {
    return "SLA Violated";
  }
  
  return "Within SLA";
};

// Define explicit function types to prevent TypeScript recursion issues
type SetServiceItemsFunc = React.Dispatch<React.SetStateAction<ServiceItem[]>>;
type SetServiceHistoryFunc = React.Dispatch<React.SetStateAction<ServiceRecord[]>>;

export const completeService = async (
  service: ServiceItem, 
  setServiceItems: SetServiceItemsFunc,
  setServiceHistory: SetServiceHistoryFunc
) => {
  try {
    const { error } = await supabase
      .from('service_requests')
      .update({
        status: "Completed",
        completion_date: new Date().toISOString()
      })
      .eq('id', service.id);
      
    if (error) throw error;
    
    const updatedService = {
      ...service,
      status: "Completed",
      slaStatus: "Met"
    };
    
    setServiceItems(prev => prev.map(item => 
      item.id === service.id ? updatedService : item
    ));
    
    await addServiceRecord(updatedService, setServiceHistory);
    
    return true;
  } catch (error) {
    console.error("Error completing service:", error);
    return false;
  }
};

export const addServiceRecord = async (
  service: ServiceItem,
  setServiceHistory: SetServiceHistoryFunc
) => {
  try {
    let saleId = null;
    
    if (service.serialNo && service.serialNo !== "N/A") {
      const { data: saleData } = await supabase
        .from('sales')
        .select('id')
        .eq('serial', service.serialNo)
        .maybeSingle();
        
      if (saleData) {
        saleId = saleData.id;
      }
    }
    
    if (!saleId) {
      const { data: serviceData } = await supabase
        .from('service_requests')
        .select('asset_id')
        .eq('id', service.id)
        .single();
        
      if (serviceData && serviceData.asset_id) {
        saleId = serviceData.asset_id;
      }
    }
    
    if (saleId) {
      await supabase
        .from('sales')
        .update({
          status: "Serviced",
          updated_at: new Date().toISOString()
        })
        .eq('id', saleId);
        
      const serviceRecord: ServiceRecord = {
        id: service.id,
        saleId: saleId,
        date: service.scheduledDate || new Date().toISOString().split('T')[0],
        technician: service.technician,
        description: `Service completed for ${service.product}`,
        partsUsed: "None",
        nextServiceDue: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0]
      };
      
      setServiceHistory(prev => [...prev, serviceRecord]);
    }
  } catch (error) {
    console.error("Error adding service record:", error);
  }
};

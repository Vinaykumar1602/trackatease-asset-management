
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

// Break the circular reference by separating the functions
export const completeService = async (
  service: ServiceItem, 
  setServiceItems: React.Dispatch<React.SetStateAction<ServiceItem[]>>,
  setServiceHistory: React.Dispatch<React.SetStateAction<ServiceRecord[]>>
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
    
    setServiceItems(currentItems => 
      currentItems.map(item => item.id === service.id ? updatedService : item)
    );
    
    // Extract the data we need before calling createServiceRecord
    const serviceData = {
      id: service.id,
      scheduledDate: service.scheduledDate,
      technician: service.technician,
      product: service.product,
      serialNo: service.serialNo
    };
    
    // Call createServiceRecord with the extracted data
    await createServiceRecord(serviceData, setServiceHistory);
    
    return true;
  } catch (error) {
    console.error("Error completing service:", error);
    return false;
  }
};

// Create a separate function that doesn't reference the original service object
export const createServiceRecord = async (
  serviceData: {
    id: string;
    scheduledDate?: string;
    technician?: string;
    product?: string;
    serialNo?: string;
  },
  setServiceHistory: React.Dispatch<React.SetStateAction<ServiceRecord[]>>
) => {
  try {
    let saleId = null;
    
    if (serviceData.serialNo && serviceData.serialNo !== "N/A") {
      const { data: saleData } = await supabase
        .from('sales')
        .select('id')
        .eq('serial', serviceData.serialNo)
        .maybeSingle();
        
      if (saleData) {
        saleId = saleData.id;
      }
    }
    
    if (!saleId) {
      const { data: serviceDataFromDb } = await supabase
        .from('service_requests')
        .select('asset_id')
        .eq('id', serviceData.id)
        .single();
        
      if (serviceDataFromDb && serviceDataFromDb.asset_id) {
        saleId = serviceDataFromDb.asset_id;
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
        id: serviceData.id,
        saleId: saleId,
        date: serviceData.scheduledDate || new Date().toISOString().split('T')[0],
        technician: serviceData.technician || 'Unknown',
        description: `Service completed for ${serviceData.product || 'item'}`,
        partsUsed: "None",
        nextServiceDue: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0]
      };
      
      // Update the state with the new record
      setServiceHistory(prevHistory => [...prevHistory, serviceRecord]);
    }
  } catch (error) {
    console.error("Error adding service record:", error);
  }
};

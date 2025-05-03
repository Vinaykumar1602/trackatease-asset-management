
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

// Complete service function - completely rewritten to avoid circular references
export const completeService = async (
  service: ServiceItem, 
  setServiceItems: React.Dispatch<React.SetStateAction<ServiceItem[]>>,
  setServiceHistory: React.Dispatch<React.SetStateAction<ServiceRecord[]>>
) => {
  try {
    // Update the service status in the database
    const { error } = await supabase
      .from('service_requests')
      .update({
        status: "Completed",
        completion_date: new Date().toISOString()
      })
      .eq('id', service.id);
      
    if (error) throw error;
    
    // Update the local state with the completed service
    const updatedService = {
      ...service,
      status: "Completed",
      slaStatus: "Met"
    };
    
    setServiceItems(currentItems => 
      currentItems.map(item => item.id === service.id ? updatedService : item)
    );
    
    // Create a service record in a separate function call
    await addServiceHistory(
      service.id, 
      service.scheduledDate || new Date().toISOString().split('T')[0], 
      service.technician || 'Unknown', 
      service.product || 'Unknown product',
      service.serialNo || 'N/A',
      setServiceHistory
    );
    
    return true;
  } catch (error) {
    console.error("Error completing service:", error);
    return false;
  }
};

// Completely separate function for adding service history
export const addServiceHistory = async (
  serviceId: string,
  serviceDate: string,
  technicianName: string,
  productName: string,
  serialNumber: string,
  setServiceHistory: React.Dispatch<React.SetStateAction<ServiceRecord[]>>
) => {
  try {
    // Find related sale if available
    let saleId = null;
    
    // Try to find by serial number first
    if (serialNumber && serialNumber !== "N/A") {
      const { data: saleData } = await supabase
        .from('sales')
        .select('id')
        .eq('serial', serialNumber)
        .maybeSingle();
        
      if (saleData) {
        saleId = saleData.id;
      }
    }
    
    // If no sale found by serial, try finding by asset_id
    if (!saleId) {
      const { data: serviceDataFromDb } = await supabase
        .from('service_requests')
        .select('asset_id')
        .eq('id', serviceId)
        .maybeSingle();
        
      if (serviceDataFromDb && serviceDataFromDb.asset_id) {
        saleId = serviceDataFromDb.asset_id;
      }
    }
    
    // If we found a related sale, update its status
    if (saleId) {
      await supabase
        .from('sales')
        .update({
          status: "Serviced",
          updated_at: new Date().toISOString()
        })
        .eq('id', saleId);
        
      // Create a service record object
      const serviceRecord: ServiceRecord = {
        id: serviceId,
        saleId: saleId,
        date: serviceDate,
        technician: technicianName,
        description: `Service completed for ${productName}`,
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

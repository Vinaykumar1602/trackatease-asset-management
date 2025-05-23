
import { supabase } from "@/integrations/supabase/client";

export const determineSlaStatus = (scheduledDate: string, status: string): string => {
  if (!scheduledDate || status === "Completed") return "Met";
  
  const scheduled = new Date(scheduledDate);
  const today = new Date();
  
  if (status === "Overdue" || (scheduled < today && status !== "Completed")) {
    return "SLA Violated";
  }
  
  return "Within SLA";
};

// Function to update a service request status in the database
export const updateServiceStatus = async (
  serviceId: string,
  status: string,
  completionDate?: string
) => {
  const updateData: { 
    status: string;
    completion_date?: string;
  } = { status };
  
  if (completionDate) {
    updateData.completion_date = completionDate;
  }
  
  try {
    const { error } = await supabase
      .from('service_requests')
      .update(updateData)
      .eq('id', serviceId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating service status:", error);
    return false;
  }
};

// Function to update a sale record by serial number
async function updateSaleRecordBySerial(serialNumber: string) {
  try {
    // Try to find by serial number
    const { data: saleData } = await supabase
      .from('sales')
      .select('id')
      .eq('product_name', serialNumber)  // Changed from serial to product_name
      .maybeSingle();
      
    if (saleData?.id) {
      // Update the sale status
      await supabase
        .from('sales')
        .update({
          status: "Serviced",
          updated_at: new Date().toISOString()
        })
        .eq('id', saleData.id);
    }
  } catch (error) {
    console.error("Error updating related sale:", error);
  }
}

// Explicitly define the service object interface to avoid circular references
export interface ServiceItem {
  id: string;
  client: string;
  product: string;
  serialNo: string;
  scheduledDate: string;
  technician: string;
  status: string;
  slaStatus: string;
}

export interface ServiceRecord {
  id: string;
  saleId: string;
  date: string;
  technician: string;
  description: string;
  partsUsed: string;
  nextServiceDue: string;
}

// Define the return type explicitly to avoid circular references
export interface ServiceCompletionResult {
  success: boolean;
  updatedService?: ServiceItem;
  serviceRecord?: ServiceRecord;
}

export const completeService = async (
  service: ServiceItem
): Promise<ServiceCompletionResult> => {
  try {
    // Update the service status in the database
    const completionDate = new Date().toISOString();
    const success = await updateServiceStatus(service.id, "Completed", completionDate);
    
    if (!success) {
      return { success: false };
    }
    
    // Create updated service object
    const updatedService: ServiceItem = {
      id: service.id,
      client: service.client,
      product: service.product,
      serialNo: service.serialNo,
      scheduledDate: service.scheduledDate,
      technician: service.technician,
      status: "Completed",
      slaStatus: "Met"
    };
    
    // Try to update related sales record if it exists
    if (service.serialNo && service.serialNo !== "N/A") {
      await updateSaleRecordBySerial(service.serialNo);
    }
    
    // Create a service record
    const serviceRecord: ServiceRecord = {
      id: service.id,
      saleId: service.product || "",
      date: service.scheduledDate || new Date().toISOString().split('T')[0],
      technician: service.technician || 'Unknown',
      description: `Service completed for ${service.product || 'Unknown product'}`,
      partsUsed: service.serialNo || 'N/A',
      nextServiceDue: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0]
    };
    
    return {
      success: true,
      updatedService,
      serviceRecord
    };
  } catch (error) {
    console.error("Error completing service:", error);
    return { success: false };
  }
};

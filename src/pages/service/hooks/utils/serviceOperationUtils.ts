
import { supabase } from "@/integrations/supabase/client";
import { ServiceItem } from "../../types";
import { determineSlaStatus } from "../../utils/serviceUtils";

// Function to find asset ID by serial number
export const findAssetIdBySerial = async (serialNo: string): Promise<string | null> => {
  if (!serialNo || serialNo === "N/A") return null;
  
  const { data: assetData } = await supabase
    .from('sales')
    .select('id')
    .eq('serial', serialNo)
    .maybeSingle();
    
  return assetData?.id || null;
};

// Schedule a new service 
export const scheduleService = async (
  newService: Omit<ServiceItem, 'id' | 'slaStatus'>, 
  userId: string
): Promise<ServiceItem | null> => {
  const assetId = await findAssetIdBySerial(newService.serialNo);
  
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
    
    return {
      ...newService,
      id: data[0].id,
      slaStatus
    };
  }
  
  return null;
};

// Edit an existing service
export const editService = async (updatedService: ServiceItem): Promise<boolean> => {
  const assetId = await findAssetIdBySerial(updatedService.serialNo);
  
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
  
  return true;
};

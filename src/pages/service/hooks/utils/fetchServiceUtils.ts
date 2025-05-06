
import { supabase } from "@/integrations/supabase/client";
import { ServiceItem, ServiceRecord, SalesData } from "../../types";
import { determineSlaStatus } from "../../utils/serviceUtils";

// Fetch service items from Supabase
export const fetchServiceItems = async (userId: string): Promise<ServiceItem[]> => {
  const { data, error } = await supabase
    .from('service_requests')
    .select(`
      *,
      sales:asset_id (*)
    `);
    
  if (error) throw error;
  
  if (data) {
    return data.map(item => {
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
        slaStatus: determineSlaStatus(item.scheduled_date, item.status),
        assetId: item.asset_id,
        priority: item.priority,
        completionDate: item.completion_date ? new Date(item.completion_date).toISOString().split('T')[0] : undefined,
        description: item.description,
        title: item.title,
        assignedTo: item.assigned_to
      };
    });
  }
  
  return [];
};

// Fetch service history
export const fetchServiceHistory = async (userId: string): Promise<ServiceRecord[]> => {
  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .eq('status', 'Completed');
    
  if (error) throw error;
  
  if (data) {
    return data.map(record => ({
      id: record.id,
      saleId: record.asset_id || "",
      date: record.scheduled_date ? new Date(record.scheduled_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      technician: record.assigned_to || "Unknown",
      description: record.title || "",
      partsUsed: record.description || "None",
      nextServiceDue: record.completion_date ? new Date(new Date(record.completion_date).setMonth(new Date(record.completion_date).getMonth() + 3)).toISOString().split('T')[0] : ""
    }));
  }
  
  return [];
};

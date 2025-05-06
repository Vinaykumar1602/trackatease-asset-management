import { supabase } from "@/integrations/supabase/client";
import { ServiceItem, ServiceRecord, SalesData } from "../types";
import { determineSlaStatus } from "../utils/serviceUtils";
import { toast as toastFunction } from "@/components/ui/use-toast";

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

// Schedule a new service - explicitly defining parameter and return types
export const scheduleService = async (
  newService: Omit<ServiceItem, 'id' | 'slaStatus'>, 
  userId: string
): Promise<ServiceItem | null> => {
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
  
  return true;
};

// Export services to CSV
export const exportToCsv = (serviceItems: ServiceItem[]) => {
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
  
  toastFunction({
    title: "Export Successful",
    description: "Service records have been exported to CSV."
  });
};

// Import services from CSV
export const importFromCsv = async (file: File, userId: string): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
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
          
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (error) {
        console.error("Error importing services:", error);
        resolve(false);
      }
    };
    reader.readAsText(file);
  });
};


import { ServiceItem } from "../../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { findAssetIdBySerial } from "./serviceOperationUtils";

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
  
  toast({
    title: "Export Successful",
    description: "Service records have been exported to CSV."
  });
};

// Parse CSV data
const parseCSV = (text: string): { headers: string[], rows: Record<string, string>[] } => {
  const rows = text.split('\n').filter(row => row.trim());
  const headers = rows[0].split(',').map(header => header.trim().toLowerCase());
  
  const parsedRows = rows.slice(1).map(row => {
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
    
    return data;
  });
  
  return { headers, rows: parsedRows };
};

// Import a single service from CSV data
const importSingleService = async (
  serviceData: Record<string, string>, 
  userId: string
): Promise<boolean> => {
  try {
    const assetId = await findAssetIdBySerial(serviceData.serialNo);
    
    const { data } = await supabase
      .from('service_requests')
      .insert({
        title: serviceData.product || "Unknown Product",
        scheduled_date: serviceData.scheduledDate || new Date().toISOString().split('T')[0],
        assigned_to: serviceData.technician !== "Unassigned" ? serviceData.technician : null,
        status: serviceData.status || "Pending",
        asset_id: assetId,
        requested_by: userId,
        priority: "medium"
      })
      .select('*');
      
    return !!(data && data[0]);
  } catch (error) {
    console.error("Error importing individual service:", error);
    return false;
  }
};

// Import services from CSV
export const importFromCsv = async (file: File, userId: string): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const { rows } = parseCSV(text);
        
        // Filter out services with insufficient data
        const validServices = rows.filter(service => 
          service.product && service.product !== "Unknown Product"
        );
        
        if (validServices.length > 0) {
          let successCount = 0;
          
          for (const service of validServices) {
            const success = await importSingleService(service, userId);
            if (success) successCount++;
          }
          
          resolve(successCount > 0);
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

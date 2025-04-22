
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ServiceItem, ServiceRecord, SalesData } from "../types";
import { determineSlaStatus } from "../utils/serviceUtils";

export const useServiceData = (userId: string | undefined) => {
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [serviceHistory, setServiceHistory] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchServiceItems = async () => {
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
          const salesData: SalesData = (item.sales as SalesData) || {};
          
          return {
            id: item.id,
            client: salesData.customer_name || "Unknown Client",
            product: salesData.product_name || item.title,
            serialNo: salesData.serial || "N/A",
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
  };

  const fetchServiceHistory = async () => {
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
  };

  useEffect(() => {
    if (userId) {
      fetchServiceItems();
      fetchServiceHistory();
    }
  }, [userId]);

  return {
    serviceItems,
    setServiceItems,
    serviceHistory,
    setServiceHistory,
    loading,
    fetchServiceItems,
    fetchServiceHistory
  };
};

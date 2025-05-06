
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { SalesItem, ServiceRecord, SaleFormData, ServiceFormData, ImportFormat } from "../types";
import { useAuth } from "@/context/AuthContext";
import { 
  fetchSalesData, 
  fetchServiceRecords, 
  createSale, 
  updateSale, 
  deleteSale, 
  createServiceRecord, 
  importData 
} from "../api/salesApi";

export function useSalesData() {
  const [salesItems, setSalesItems] = useState<SalesItem[]>([]);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadSalesData();
      loadServiceRecords();
    }
  }, [user?.id]);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      const data = await fetchSalesData();
      setSalesItems(data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      toast({
        title: "Error",
        description: "Failed to load sales data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadServiceRecords = async () => {
    try {
      const data = await fetchServiceRecords();
      setServiceRecords(data);
    } catch (error) {
      console.error('Error fetching service records:', error);
      toast({
        title: "Error",
        description: "Failed to load service records",
        variant: "destructive"
      });
    }
  };

  const handleAddSale = async (formData: SaleFormData) => {
    try {
      if (!user?.id) return;

      console.log("Adding sale with data:", formData);

      const newItem = await createSale(formData, user.id);

      if (newItem) {
        setSalesItems(prev => [...prev, newItem]);
        
        toast({
          title: "Sale Added",
          description: `${newItem.productName} has been added to sales records.`
        });
      }
    } catch (error) {
      console.error('Error adding sale:', error);
      toast({
        title: "Error",
        description: "Failed to add sale record",
        variant: "destructive"
      });
    }
  };

  const handleUpdateSale = async (id: string, formData: SaleFormData) => {
    try {
      const success = await updateSale(id, formData);

      if (success) {
        setSalesItems(prev => prev.map(item => {
          if (item.id === id) {
            return { 
              ...item, 
              ...formData,
              status: formData.status || item.status
            };
          }
          return item;
        }));
        
        toast({
          title: "Sale Updated",
          description: "The sale record has been updated."
        });
      }
    } catch (error) {
      console.error('Error updating sale:', error);
      toast({
        title: "Error",
        description: "Failed to update sale record",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSale = async (id: string) => {
    try {
      const success = await deleteSale(id);

      if (success) {
        setSalesItems(prev => prev.filter(item => item.id !== id));
        setServiceRecords(prev => prev.filter(record => record.saleId !== id));
        
        toast({
          title: "Sale Deleted",
          description: "The sale record has been removed."
        });
      }
    } catch (error) {
      console.error('Error deleting sale:', error);
      toast({
        title: "Error",
        description: "Failed to delete sale record",
        variant: "destructive"
      });
    }
  };

  const handleAddService = async (formData: ServiceFormData) => {
    try {
      if (!user?.id) return;

      const newRecord = await createServiceRecord(formData, user.id);
      
      if (newRecord) {
        setServiceRecords(prev => [...prev, newRecord]);
          
        setSalesItems(prev => prev.map(item => {
          if (item.id === formData.saleId) {
            return {
              ...item,
              lastService: formData.date,
              lastServiceNotes: formData.description,
              status: "Serviced"
            };
          }
          return item;
        }));
        
        toast({
          title: "Service Added",
          description: "Service record has been added successfully."
        });

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error adding service record:', error);
      toast({
        title: "Error",
        description: "Failed to add service record",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleImportComplete = async (data: ImportFormat[], type: 'sales' | 'service') => {
    try {
      if (!user?.id || !data.length) return;
      
      const success = await importData(data, type, user.id);
      
      if (success) {
        // Refresh data after import
        loadSalesData();
        loadServiceRecords();
        
        toast({
          title: "Import Successful",
          description: `${data.length} ${type} records have been imported.`
        });
      }
    } catch (error) {
      console.error(`Error importing ${type} data:`, error);
      toast({
        title: "Import Failed",
        description: `Failed to import ${type} records.`,
        variant: "destructive"
      });
    }
  };

  return {
    salesItems,
    serviceRecords,
    loading,
    handleAddSale,
    handleUpdateSale,
    handleDeleteSale,
    handleAddService,
    handleImportComplete
  };
}

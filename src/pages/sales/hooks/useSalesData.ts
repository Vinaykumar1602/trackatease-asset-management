
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { SalesItem, ServiceRecord, SaleFormData, ServiceFormData, ImportFormat } from "../types";
import { calculateStatus } from "../utils/salesUtils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export function useSalesData() {
  const [salesItems, setSalesItems] = useState<SalesItem[]>([]);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSalesData();
      fetchServiceRecords();
    }
  }, [user?.id]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sales')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        // Transform the data to match the expected SalesItem structure
        const formattedItems: SalesItem[] = data.map(item => ({
          id: item.id,
          productName: item.product_name || "Unknown Product",
          serialNo: item.product_name || `SALES-${item.id}`, // Use product_name as fallback
          client: item.customer_name || "Unknown Client",
          clientBranch: "",  // These fields may not exist in DB
          clientBranchCode: "",
          contact: "",
          saleDate: new Date(item.sale_date).toISOString().split('T')[0],
          warrantyExpiry: new Date(new Date(item.sale_date).setFullYear(new Date(item.sale_date).getFullYear() + 1)).toISOString().split('T')[0], // Set warranty to 1 year
          amcStartDate: new Date(item.sale_date).toISOString().split('T')[0],
          amcExpiryDate: new Date(new Date(item.sale_date).setFullYear(new Date(item.sale_date).getFullYear() + 1)).toISOString().split('T')[0], // Set AMC to 1 year
          status: item.status || "Active",
          location: "",
          lastService: "",
          lastServiceNotes: ""
        }));

        setSalesItems(formattedItems);
      }
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

  const fetchServiceRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        // Transform the data to match the expected ServiceRecord structure
        const formattedRecords: ServiceRecord[] = data.map(record => ({
          id: record.id,
          saleId: record.asset_id || "", // Use asset_id as saleId
          date: record.scheduled_date ? new Date(record.scheduled_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          technician: record.assigned_to || "Unassigned",
          description: record.title || "Service visit",
          partsUsed: "",
          nextServiceDue: record.completion_date ? new Date(record.completion_date).toISOString().split('T')[0] : "",
          remarks: record.description || ""
        }));

        setServiceRecords(formattedRecords);
      }
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

      const { data, error } = await supabase
        .from('sales')
        .insert({
          product_name: formData.productName,
          customer_name: formData.client,
          sale_date: formData.saleDate,
          status: "Active",
          created_by: user.id,
          quantity: 1,
          amount: 0
        })
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        const newItem: SalesItem = {
          id: data[0].id,
          productName: data[0].product_name,
          serialNo: data[0].product_name || `SALES-${data[0].id}`,
          client: data[0].customer_name,
          clientBranch: formData.clientBranch || '',
          clientBranchCode: formData.clientBranchCode || '',
          contact: formData.contact || '',
          saleDate: new Date(data[0].sale_date).toISOString().split('T')[0],
          warrantyExpiry: formData.warrantyExpiry,
          amcStartDate: formData.amcStartDate !== 'N/A' ? formData.amcStartDate : 'N/A',
          amcExpiryDate: formData.amcExpiryDate !== 'N/A' ? formData.amcExpiryDate : 'N/A',
          status: data[0].status,
          location: formData.location || '',
          lastService: '',
          lastServiceNotes: ''
        };

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
      const { error } = await supabase
        .from('sales')
        .update({
          product_name: formData.productName,
          customer_name: formData.client,
          sale_date: formData.saleDate,
          status: formData.status || "Active",
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

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
      // First delete related service records
      await supabase
        .from('service_requests')
        .delete()
        .eq('asset_id', id);
        
      // Then delete the sale
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setSalesItems(prev => prev.filter(item => item.id !== id));
      setServiceRecords(prev => prev.filter(record => record.saleId !== id));
      
      toast({
        title: "Sale Deleted",
        description: "The sale record has been removed."
      });
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

      const { data, error } = await supabase
        .from('service_requests')
        .insert({
          asset_id: formData.saleId,
          title: formData.description,
          description: formData.remarks,
          scheduled_date: formData.date,
          priority: "medium",
          status: "completed",
          requested_by: user.id,
          assigned_to: formData.technician
        })
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        const newRecord: ServiceRecord = {
          id: data[0].id,
          saleId: data[0].asset_id || "",
          date: data[0].scheduled_date ? new Date(data[0].scheduled_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          technician: data[0].assigned_to || "Unassigned",
          description: data[0].title || "Service visit",
          partsUsed: formData.partsUsed || '',
          nextServiceDue: formData.nextServiceDue || '',
          remarks: data[0].description || ''
        };
        
        setServiceRecords(prev => [...prev, newRecord]);
        
        // Update the sale status to indicate service
        await supabase
          .from('sales')
          .update({
            status: "Serviced",
            updated_at: new Date().toISOString()
          })
          .eq('id', formData.saleId);
          
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
      }
    } catch (error) {
      console.error('Error adding service record:', error);
      toast({
        title: "Error",
        description: "Failed to add service record",
        variant: "destructive"
      });
    }
  };

  const handleImportItems = async (data: ImportFormat[], type: 'sales' | 'service') => {
    try {
      if (!user?.id || !data.length) return;
      
      if (type === 'sales') {
        // Transform import data to match the database schema
        const salesData = data.map(item => ({
          product_name: item.productName || 'Unknown Product',
          customer_name: item.client || 'Unknown Client',
          sale_date: item.saleDate || new Date().toISOString(),
          status: item.status || 'Active',
          created_by: user.id,
          quantity: 1,
          amount: 0
        }));

        const { data: insertedData, error } = await supabase
          .from('sales')
          .insert(salesData)
          .select();

        if (error) {
          throw error;
        }

        if (insertedData) {
          const newSales: SalesItem[] = insertedData.map(item => ({
            id: item.id,
            productName: item.product_name,
            serialNo: item.product_name || `SALES-${item.id}`,
            client: item.customer_name,
            clientBranch: '',
            clientBranchCode: '',
            contact: '',
            saleDate: new Date(item.sale_date).toISOString().split('T')[0],
            warrantyExpiry: new Date(new Date(item.sale_date).setFullYear(new Date(item.sale_date).getFullYear() + 1)).toISOString().split('T')[0],
            amcStartDate: new Date(item.sale_date).toISOString().split('T')[0],
            amcExpiryDate: new Date(new Date(item.sale_date).setFullYear(new Date(item.sale_date).getFullYear() + 1)).toISOString().split('T')[0],
            status: item.status,
            location: '',
            lastService: '',
            lastServiceNotes: ''
          }));

          setSalesItems(prev => [...prev, ...newSales]);
        }
      } else {
        // Transform import data to match the service_requests table schema
        const serviceData = data.map(item => ({
          asset_id: item.saleId,
          title: item.description || 'Service visit',
          description: item.remarks || '',
          scheduled_date: item.date || new Date().toISOString(),
          priority: 'medium',
          status: 'completed',
          requested_by: user.id,
          assigned_to: item.technician || 'Unknown'
        }));

        const { data: insertedData, error } = await supabase
          .from('service_requests')
          .insert(serviceData)
          .select();

        if (error) {
          throw error;
        }

        if (insertedData) {
          const newRecords: ServiceRecord[] = insertedData.map(record => ({
            id: record.id,
            saleId: record.asset_id || "",
            date: record.scheduled_date ? new Date(record.scheduled_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            technician: record.assigned_to || "Unassigned",
            description: record.title || "Service visit",
            partsUsed: "",
            nextServiceDue: "",
            remarks: record.description || ''
          }));

          setServiceRecords(prev => [...prev, ...newRecords]);
          
          // Update the sales items with the latest service information
          for (const record of insertedData) {
            if (record.asset_id) {
              await supabase
                .from('sales')
                .update({
                  status: "Serviced",
                  updated_at: new Date().toISOString()
                })
                .eq('id', record.asset_id);
            }
          }
          
          // Refresh sales data to get the updated service info
          fetchSalesData();
        }
      }
      
      toast({
        title: "Import Successful",
        description: `${data.length} ${type} records have been imported.`
      });
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
    handleImportComplete: handleImportItems
  };
}


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
          productName: item.product_name,
          serialNo: item.serial_no || `SALES-${item.id}`,
          client: item.customer_name,
          clientBranch: item.client_branch || '',
          clientBranchCode: item.client_branch_code || '',
          contact: item.contact_person || '',
          saleDate: new Date(item.sale_date).toISOString().split('T')[0],
          warrantyExpiry: item.warranty_expiry ? new Date(item.warranty_expiry).toISOString().split('T')[0] : '',
          amcStartDate: item.amc_start_date ? new Date(item.amc_start_date).toISOString().split('T')[0] : 'N/A',
          amcExpiryDate: item.amc_expiry_date ? new Date(item.amc_expiry_date).toISOString().split('T')[0] : 'N/A',
          status: item.status || calculateStatus({
            warrantyExpiry: item.warranty_expiry,
            amcExpiryDate: item.amc_expiry_date
          }),
          location: item.location || '',
          lastService: item.last_service ? new Date(item.last_service).toISOString().split('T')[0] : '',
          lastServiceNotes: item.last_service_notes || ''
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
        .from('service_records')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        // Transform the data to match the expected ServiceRecord structure
        const formattedRecords: ServiceRecord[] = data.map(record => ({
          id: record.id,
          saleId: record.sale_id,
          date: new Date(record.service_date).toISOString().split('T')[0],
          technician: record.technician,
          description: record.description,
          partsUsed: record.parts_used || '',
          nextServiceDue: record.next_service_due ? new Date(record.next_service_due).toISOString().split('T')[0] : '',
          remarks: record.remarks || ''
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
          serial_no: formData.serialNo,
          customer_name: formData.client,
          client_branch: formData.clientBranch,
          client_branch_code: formData.clientBranchCode,
          contact_person: formData.contact,
          sale_date: formData.saleDate,
          warranty_expiry: formData.warrantyExpiry,
          amc_start_date: formData.amcStartDate !== 'N/A' ? formData.amcStartDate : null,
          amc_expiry_date: formData.amcExpiryDate !== 'N/A' ? formData.amcExpiryDate : null,
          status: formData.status || calculateStatus(formData),
          location: formData.location,
          created_by: user.id
        })
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        const newItem: SalesItem = {
          id: data[0].id,
          productName: data[0].product_name,
          serialNo: data[0].serial_no || `SALES-${data[0].id}`,
          client: data[0].customer_name,
          clientBranch: data[0].client_branch || '',
          clientBranchCode: data[0].client_branch_code || '',
          contact: data[0].contact_person || '',
          saleDate: new Date(data[0].sale_date).toISOString().split('T')[0],
          warrantyExpiry: data[0].warranty_expiry ? new Date(data[0].warranty_expiry).toISOString().split('T')[0] : '',
          amcStartDate: data[0].amc_start_date ? new Date(data[0].amc_start_date).toISOString().split('T')[0] : 'N/A',
          amcExpiryDate: data[0].amc_expiry_date ? new Date(data[0].amc_expiry_date).toISOString().split('T')[0] : 'N/A',
          status: data[0].status,
          location: data[0].location || '',
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
          serial_no: formData.serialNo,
          customer_name: formData.client,
          client_branch: formData.clientBranch,
          client_branch_code: formData.clientBranchCode,
          contact_person: formData.contact,
          sale_date: formData.saleDate,
          warranty_expiry: formData.warrantyExpiry,
          amc_start_date: formData.amcStartDate !== 'N/A' ? formData.amcStartDate : null,
          amc_expiry_date: formData.amcExpiryDate !== 'N/A' ? formData.amcExpiryDate : null,
          status: formData.status || calculateStatus(formData),
          location: formData.location,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setSalesItems(prev => prev.map(item => {
        if (item.id === id) {
          const status = formData.status || calculateStatus(formData);
          return { ...item, ...formData, status };
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
        .from('service_records')
        .delete()
        .eq('sale_id', id);
        
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
        .from('service_records')
        .insert({
          sale_id: formData.saleId,
          service_date: formData.date,
          technician: formData.technician,
          description: formData.description,
          parts_used: formData.partsUsed,
          next_service_due: formData.nextServiceDue,
          remarks: formData.remarks,
          created_by: user.id
        })
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        const newRecord: ServiceRecord = {
          id: data[0].id,
          saleId: data[0].sale_id,
          date: new Date(data[0].service_date).toISOString().split('T')[0],
          technician: data[0].technician,
          description: data[0].description,
          partsUsed: data[0].parts_used || '',
          nextServiceDue: data[0].next_service_due ? new Date(data[0].next_service_due).toISOString().split('T')[0] : '',
          remarks: data[0].remarks || ''
        };
        
        setServiceRecords(prev => [...prev, newRecord]);
        
        // Update the last service info on the sale item
        await supabase
          .from('sales')
          .update({
            last_service: formData.date,
            last_service_notes: formData.description
          })
          .eq('id', formData.saleId);
          
        setSalesItems(prev => prev.map(item => {
          if (item.id === formData.saleId) {
            return {
              ...item,
              lastService: formData.date,
              lastServiceNotes: formData.description
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
        const salesData = data.map(item => ({
          product_name: item.productName || 'Unknown Product',
          serial_no: item.serialNo,
          customer_name: item.client || 'Unknown Client',
          client_branch: item.clientBranch,
          client_branch_code: item.clientBranchCode,
          contact_person: item.contact || '',
          sale_date: item.saleDate || new Date().toISOString(),
          warranty_expiry: item.warrantyExpiry,
          amc_start_date: item.amcStartDate !== 'N/A' ? item.amcStartDate : null,
          amc_expiry_date: item.amcExpiryDate !== 'N/A' ? item.amcExpiryDate : null,
          status: item.status || 'Active',
          location: item.location,
          created_by: user.id
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
            serialNo: item.serial_no || `SALES-${item.id}`,
            client: item.customer_name,
            clientBranch: item.client_branch || '',
            clientBranchCode: item.client_branch_code || '',
            contact: item.contact_person || '',
            saleDate: new Date(item.sale_date).toISOString().split('T')[0],
            warrantyExpiry: item.warranty_expiry ? new Date(item.warranty_expiry).toISOString().split('T')[0] : '',
            amcStartDate: item.amc_start_date ? new Date(item.amc_start_date).toISOString().split('T')[0] : 'N/A',
            amcExpiryDate: item.amc_expiry_date ? new Date(item.amc_expiry_date).toISOString().split('T')[0] : 'N/A',
            status: item.status,
            location: item.location || '',
            lastService: '',
            lastServiceNotes: ''
          }));

          setSalesItems(prev => [...prev, ...newSales]);
        }
      } else {
        const serviceData = data.map(item => ({
          sale_id: item.saleId,
          service_date: item.date || new Date().toISOString(),
          technician: item.technician || 'Unknown',
          description: item.description || 'Service visit',
          parts_used: item.partsUsed,
          next_service_due: item.nextServiceDue,
          remarks: item.remarks,
          created_by: user.id
        }));

        const { data: insertedData, error } = await supabase
          .from('service_records')
          .insert(serviceData)
          .select();

        if (error) {
          throw error;
        }

        if (insertedData) {
          const newRecords: ServiceRecord[] = insertedData.map(record => ({
            id: record.id,
            saleId: record.sale_id,
            date: new Date(record.service_date).toISOString().split('T')[0],
            technician: record.technician,
            description: record.description,
            partsUsed: record.parts_used || '',
            nextServiceDue: record.next_service_due ? new Date(record.next_service_due).toISOString().split('T')[0] : '',
            remarks: record.remarks || ''
          }));

          setServiceRecords(prev => [...prev, ...newRecords]);
          
          // Update the sales items with the latest service information
          for (const record of insertedData) {
            await supabase
              .from('sales')
              .update({
                last_service: record.service_date,
                last_service_notes: record.description
              })
              .eq('id', record.sale_id);
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

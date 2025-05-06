
import { supabase } from "@/integrations/supabase/client";
import { SalesItem, ServiceRecord, SaleFormData, ServiceFormData, ImportFormat } from "../types";
import { calculateStatus } from "../utils/salesUtils";

// Fetch all sales
export const fetchSalesData = async (): Promise<SalesItem[]> => {
  const { data, error } = await supabase
    .from('sales')
    .select('*');

  if (error) {
    throw error;
  }

  if (data) {
    // Transform the data to match the expected SalesItem structure
    return data.map(item => ({
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
  }

  return [];
};

// Fetch all service records
export const fetchServiceRecords = async (): Promise<ServiceRecord[]> => {
  const { data, error } = await supabase
    .from('service_requests')
    .select('*');

  if (error) {
    throw error;
  }

  if (data) {
    // Transform the data to match the expected ServiceRecord structure
    return data.map(record => ({
      id: record.id,
      saleId: record.asset_id || "", // Use asset_id as saleId
      date: record.scheduled_date ? new Date(record.scheduled_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      technician: record.assigned_to || "Unassigned",
      description: record.title || "Service visit",
      partsUsed: "",
      nextServiceDue: record.completion_date ? new Date(record.completion_date).toISOString().split('T')[0] : "",
      remarks: record.description || ""
    }));
  }

  return [];
};

// Create a new sale
export const createSale = async (
  formData: SaleFormData, 
  userId: string
): Promise<SalesItem | null> => {
  const { data, error } = await supabase
    .from('sales')
    .insert({
      product_name: formData.productName,
      customer_name: formData.client,
      sale_date: formData.saleDate,
      status: "Active",
      created_by: userId,
      quantity: 1,
      amount: 0
    })
    .select();

  if (error) {
    console.error("Supabase insert error:", error);
    throw error;
  }

  console.log("Sale added successfully, response:", data);

  if (data && data[0]) {
    return {
      id: data[0].id,
      productName: data[0].product_name,
      serialNo: formData.serialNo || `SALES-${data[0].id}`,
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
  }

  return null;
};

// Update a sale
export const updateSale = async (
  id: string, 
  formData: SaleFormData
): Promise<boolean> => {
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

  return true;
};

// Delete a sale
export const deleteSale = async (id: string): Promise<boolean> => {
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

    return true;
  } catch (error) {
    console.error('Error deleting sale:', error);
    throw error;
  }
};

// Create a new service record
export const createServiceRecord = async (
  formData: ServiceFormData,
  userId: string
): Promise<ServiceRecord | null> => {
  const { data, error } = await supabase
    .from('service_requests')
    .insert({
      asset_id: formData.saleId,
      title: formData.description,
      description: formData.remarks,
      scheduled_date: formData.date,
      priority: "medium",
      status: "completed",
      requested_by: userId,
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
    
    // Update the sale status to indicate service
    await supabase
      .from('sales')
      .update({
        status: "Serviced",
        updated_at: new Date().toISOString()
      })
      .eq('id', formData.saleId);
    
    return newRecord;
  }

  return null;
};

// Import data (sales or service)
export const importData = async (
  data: ImportFormat[], 
  type: 'sales' | 'service',
  userId: string
): Promise<boolean> => {
  try {
    if (!userId || !data.length) return false;
    
    if (type === 'sales') {
      // Transform import data to match the database schema
      const salesData = data.map(item => ({
        product_name: item.productName || 'Unknown Product',
        customer_name: item.client || 'Unknown Client',
        sale_date: item.saleDate || new Date().toISOString(),
        status: item.status || 'Active',
        created_by: userId,
        quantity: 1,
        amount: 0
      }));

      const { error } = await supabase
        .from('sales')
        .insert(salesData);

      if (error) {
        throw error;
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
        requested_by: userId,
        assigned_to: item.technician || 'Unknown'
      }));

      const { error } = await supabase
        .from('service_requests')
        .insert(serviceData);

      if (error) {
        throw error;
      }

      // Update the sales items with the latest service information
      for (const record of data) {
        if (record.saleId) {
          await supabase
            .from('sales')
            .update({
              status: "Serviced",
              updated_at: new Date().toISOString()
            })
            .eq('id', record.saleId);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error importing ${type} data:`, error);
    throw error;
  }
};


import { supabase } from "@/integrations/supabase/client";
import { ServiceItem, ServiceFormData } from "../types";

// Fetch all service records
export const fetchServices = async (): Promise<ServiceItem[]> => {
  const { data, error } = await supabase
    .from('service_requests')
    .select('*');

  if (error) {
    throw error;
  }

  if (data) {
    return data.map(service => ({
      id: service.id,
      title: service.title,
      product: service.title || "",  // Map title to product for compatibility
      client: "", // Will be populated later with sales data
      serialNo: "", // Will be populated later with sales data
      assetId: service.asset_id || "",
      status: service.status,
      priority: service.priority,
      scheduledDate: service.scheduled_date ? new Date(service.scheduled_date).toISOString().split('T')[0] : "",
      technician: service.assigned_to || "",
      assignedTo: service.assigned_to || "",
      completionDate: service.completion_date ? new Date(service.completion_date).toISOString().split('T')[0] : "",
      slaStatus: calculateSlaStatus(service.priority, service.scheduled_date),
      createdAt: service.created_at ? new Date(service.created_at).toISOString() : "",
      updatedAt: service.updated_at ? new Date(service.updated_at).toISOString() : "",
      description: service.description || ""
    }));
  }

  return [];
};

// Create a new service record
export const createService = async (
  service: ServiceFormData,
  userId: string
): Promise<ServiceItem | null> => {
  console.log("Creating service record:", service);

  const { data, error } = await supabase
    .from('service_requests')
    .insert({
      title: service.title || service.description,
      asset_id: service.assetId || null,
      status: service.status || "pending",
      priority: service.priority || "medium",
      scheduled_date: service.scheduledDate || service.date,
      assigned_to: service.assignedTo || service.technician || null,
      description: service.description || service.remarks || null,
      requested_by: userId
    })
    .select();

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }

  if (data && data[0]) {
    return {
      id: data[0].id,
      title: data[0].title,
      product: data[0].title || "",  // Map title to product for compatibility
      client: "", // Will be populated later
      serialNo: "", // Will be populated later
      assetId: data[0].asset_id || "",
      status: data[0].status,
      priority: data[0].priority,
      scheduledDate: data[0].scheduled_date ? new Date(data[0].scheduled_date).toISOString().split('T')[0] : "",
      technician: data[0].assigned_to || "",
      assignedTo: data[0].assigned_to || "",
      completionDate: data[0].completion_date ? new Date(data[0].completion_date).toISOString().split('T')[0] : "",
      slaStatus: calculateSlaStatus(data[0].priority, data[0].scheduled_date),
      createdAt: data[0].created_at ? new Date(data[0].created_at).toISOString() : "",
      updatedAt: data[0].updated_at ? new Date(data[0].updated_at).toISOString() : "",
      description: data[0].description || ""
    };
  }

  return null;
};

// Update a service record
export const updateService = async (service: ServiceItem): Promise<boolean> => {
  const { error } = await supabase
    .from('service_requests')
    .update({
      title: service.title || service.product,
      asset_id: service.assetId || null,
      status: service.status,
      priority: service.priority || "medium",
      scheduled_date: service.scheduledDate,
      completion_date: service.completionDate || null,
      assigned_to: service.assignedTo || service.technician || null,
      description: service.description || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', service.id);

  if (error) {
    throw error;
  }

  return true;
};

// Delete a service record
export const deleteService = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('service_requests')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }

  return true;
};

// Helper function to calculate SLA status
const calculateSlaStatus = (priority: string, scheduledDate: string | null): string => {
  if (!scheduledDate) return "na";
  
  const now = new Date();
  const scheduled = new Date(scheduledDate);
  const diffDays = Math.floor((scheduled.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (priority === "high") {
    if (diffDays < 0) return "breached";
    if (diffDays < 1) return "at-risk";
  } else if (priority === "medium") {
    if (diffDays < 0) return "breached";
    if (diffDays < 3) return "at-risk";
  } else {
    if (diffDays < 0) return "breached";
    if (diffDays < 7) return "at-risk";
  }
  
  return "on-track";
};


import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ServiceEditDialog } from "./ServiceEditDialog";
import { ServiceCalendarView } from "./ServiceCalendarView";
import { ServiceTable } from "./ServiceTable";
import { ServiceHeader } from "./ServiceHeader";
import { ServiceFilters } from "./ServiceFilters";
import { ServiceItem } from "../types";
import { useServiceView } from "../context/ServiceViewContext";
import { useAuth } from "@/context/AuthContext";
import { useServiceData } from "../hooks/useServiceData";
import { ServiceLoadingState } from "./ServiceLoadingState";

export function ServiceManagementContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [technicianFilter, setTechnicianFilter] = useState<string>("All");
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const { viewMode } = useServiceView();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const {
    serviceItems,
    loading,
    completeService: handleServiceCompletion,
    scheduleService,
    editService,
    exportServices,
    importServices
  } = useServiceData(user?.id);

  const handleCompleteService = async (id: string) => {
    const service = serviceItems.find(item => item.id === id);
    if (!service) return;
    
    const success = await handleServiceCompletion(service);
    
    if (success) {
      toast({
        title: "Service Completed",
        description: "The service has been marked as complete."
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to complete service",
        variant: "destructive"
      });
    }
  };
  
  const handleImportServices = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    
    const success = await importServices(file);
    
    if (success) {
      toast({
        title: "Import Successful",
        description: "Service records have been imported successfully."
      });
    } else {
      toast({
        title: "Import Failed",
        description: "There was an error importing the file. Please check the format.",
        variant: "destructive"
      });
    }
    
    // Clear the input field so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Get unique technicians for the filter
  const technicians = Array.from(
    new Set(serviceItems.map(item => item.technician).filter(Boolean))
  ) as string[];
  
  const filteredServiceItems = useFilteredServices(serviceItems, searchQuery, statusFilter, technicianFilter);

  if (loading) {
    return <ServiceLoadingState />;
  }

  return (
    <ServiceManagementUI
      filteredServiceItems={filteredServiceItems}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      technicianFilter={technicianFilter}
      setTechnicianFilter={setTechnicianFilter}
      technicians={technicians}
      viewMode={viewMode}
      serviceItems={serviceItems}
      scheduleService={scheduleService}
      exportServices={exportServices}
      onImportServices={handleImportServices}
      onEditService={setEditingService}
      onCompleteService={handleCompleteService}
      editingService={editingService}
      editService={editService}
    />
  );
}

// Extract filtering logic to a custom hook
function useFilteredServices(
  serviceItems: ServiceItem[],
  searchQuery: string,
  statusFilter: string,
  technicianFilter: string
) {
  return serviceItems.filter(item => {
    const matchesSearch = 
      searchQuery === "" || 
      item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.technician && item.technician.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesTechnician = technicianFilter === "All" || item.technician === technicianFilter;
    
    return matchesSearch && matchesStatus && matchesTechnician;
  });
}

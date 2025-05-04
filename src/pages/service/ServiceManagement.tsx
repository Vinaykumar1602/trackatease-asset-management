
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ServiceEditDialog } from "./components/ServiceEditDialog";
import { ServiceCalendarView } from "./components/ServiceCalendarView";
import { ServiceTable } from "./components/ServiceTable";
import { ServiceHeader } from "./components/ServiceHeader";
import { ServiceFilters } from "./components/ServiceFilters";
import { ServiceItem, CalendarService } from "./types";
import { ServiceViewProvider, useServiceView } from "./context/ServiceViewContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useServiceData } from "./hooks/useServiceData";

// Main container component
export default function ServiceManagement() {
  return (
    <ServiceViewProvider>
      <ServiceManagementContent />
    </ServiceViewProvider>
  );
}

// Content component that uses the context
function ServiceManagementContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [technicianFilter, setTechnicianFilter] = useState<string>("All");
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const { viewMode, setViewMode } = useServiceView();
  
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
  
  const filteredServiceItems = serviceItems.filter(item => {
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

  const servicesForCalendar: CalendarService[] = serviceItems.map(item => {
    let statusValue: CalendarService['status'];
    
    const lowercaseStatus = item.status.toLowerCase();
    
    if (lowercaseStatus === 'scheduled') statusValue = 'scheduled';
    else if (lowercaseStatus === 'in progress') statusValue = 'in progress';
    else if (lowercaseStatus === 'completed') statusValue = 'completed';
    else if (lowercaseStatus === 'cancelled') statusValue = 'cancelled';
    else if (lowercaseStatus === 'pending') statusValue = 'pending';
    else if (lowercaseStatus === 'overdue') statusValue = 'overdue';
    else statusValue = 'pending';
    
    return {
      id: item.id,
      assetId: item.id,
      scheduledDate: item.scheduledDate,
      description: item.product,
      status: statusValue
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading service data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Management</h1>
          <p className="text-muted-foreground">
            Schedule, track, and manage service requests.
          </p>
        </div>
        <ServiceHeader 
          viewMode={viewMode} 
          setViewMode={setViewMode}
          onScheduleService={scheduleService}
          onExport={exportServices}
          onImport={handleImportServices}
        />
      </div>

      <ServiceFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        technicianFilter={technicianFilter}
        setTechnicianFilter={setTechnicianFilter}
        technicians={technicians}
      />

      <div className="border rounded-md">
        {viewMode === "table" ? (
          <ServiceTable 
            services={filteredServiceItems}
            onEdit={setEditingService}
            onComplete={handleCompleteService}
          />
        ) : (
          <ServiceCalendarView 
            services={servicesForCalendar}
            onServiceClick={(id: string) => {
              const service = serviceItems.find(item => item.id === id);
              if (service) {
                setEditingService(service);
              }
            }}
          />
        )}
      </div>

      {editingService && (
        <ServiceEditDialog
          service={editingService}
          onSave={editService}
          onCancel={() => setEditingService(null)}
        />
      )}
    </div>
  );
}

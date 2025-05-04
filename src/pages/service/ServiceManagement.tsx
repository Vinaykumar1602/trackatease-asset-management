
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ServiceEditDialog } from "./components/ServiceEditDialog";
import { ServiceCalendarView } from "./components/ServiceCalendarView";
import { ServiceTable } from "./components/ServiceTable";
import { ServiceHeader } from "./components/ServiceHeader";
import { ServiceFilters } from "./components/ServiceFilters";
import { useServiceData } from "./hooks/useServiceData";
import { ServiceItem, CalendarService, ServiceRecord } from "./types";
import { determineSlaStatus } from "./utils/serviceUtils";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function ServiceManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const {
    serviceItems,
    setServiceItems,
    serviceHistory,
    setServiceHistory,
    loading,
    fetchServiceItems,
    completeService: handleServiceCompletion
  } = useServiceData(user?.id);

  const handleScheduleService = async (newService: Omit<ServiceItem, 'id' | 'slaStatus'>) => {
    try {
      if (!user?.id) return;
      
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
          requested_by: user.id,
          priority: "medium",
          description: `Service for ${newService.product}`
        })
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        const slaStatus = determineSlaStatus(newService.scheduledDate, newService.status);
        
        const serviceToAdd: ServiceItem = {
          ...newService,
          id: data[0].id,
          slaStatus
        };
        
        setServiceItems(prev => [...prev, serviceToAdd]);
        
        toast({
          title: "Service Scheduled",
          description: `Service for ${serviceToAdd.product} has been scheduled for ${serviceToAdd.scheduledDate}.`
        });
      }
    } catch (error) {
      console.error("Error scheduling service:", error);
      toast({
        title: "Error",
        description: "Failed to schedule service",
        variant: "destructive"
      });
    }
  };
  
  const handleEditService = async (updatedService: ServiceItem) => {
    try {
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
      
      setServiceItems(prev => prev.map(item => 
        item.id === updatedService.id ? updatedService : item
      ));
      
      if (updatedService.status === "Completed" && editingService?.status !== "Completed") {
        const serviceRecord: ServiceRecord = {
          id: updatedService.id,
          saleId: updatedService.product || "",
          date: updatedService.scheduledDate || new Date().toISOString().split('T')[0],
          technician: updatedService.technician || 'Unknown',
          description: `Service completed for ${updatedService.product || 'Unknown product'}`,
          partsUsed: updatedService.serialNo || 'N/A',
          nextServiceDue: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0]
        };
        
        setServiceHistory(prev => [...prev, serviceRecord]);
      }
      
      setEditingService(null);
      
      toast({
        title: "Service Updated",
        description: `Service details for ${updatedService.product} have been updated.`
      });
    } catch (error) {
      console.error("Error updating service:", error);
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive"
      });
    }
  };
  
  const handleCompleteService = async (id: string) => {
    const service = serviceItems.find(item => item.id === id);
    if (!service) return;
    
    // Use the handleServiceCompletion function from the hook
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
  
  const handleExportServices = () => {
    const headers = ["ID", "Client", "Product", "Serial No", "Scheduled Date", "Technician", "Status", "SLA Status"];
    const csvContent = [
      headers.join(','),
      ...filteredServiceItems.map(item => 
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
  
  const handleImportServices = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim());
        const headers = rows[0].split(',');
        
        const importedServices = rows.slice(1).map(row => {
          const values = row.split(',');
          return {
            client: values[1] || "",
            title: values[2] || "",
            serialNo: values[3] || "",
            scheduledDate: values[4] || new Date().toISOString(),
            technician: values[5] || "",
            status: values[6] || "Scheduled"
          };
        });
        
        const validServices = importedServices.filter(service => service.title);
        
        if (validServices.length > 0) {
          for (const service of validServices) {
            let assetId = null;
            
            if (service.serialNo) {
              const { data: assetData } = await supabase
                .from('sales')
                .select('id')
                .eq('serial', service.serialNo)
                .maybeSingle();
                
              if (assetData) {
                assetId = assetData.id;
              }
            }
            
            await supabase
              .from('service_requests')
              .insert({
                title: service.title,
                scheduled_date: service.scheduledDate,
                assigned_to: service.technician !== "Unassigned" ? service.technician : null,
                status: service.status,
                asset_id: assetId,
                requested_by: user.id,
                priority: "medium"
              });
          }
          
          fetchServiceItems();
          
          toast({
            title: "Import Successful",
            description: `${validServices.length} service records have been imported.`
          });
        }
      } catch (error) {
        console.error("Error importing services:", error);
        toast({
          title: "Import Failed",
          description: "There was an error importing the file. Please check the format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const filteredServiceItems = serviceItems.filter(item => {
    const matchesSearch = 
      searchQuery === "" || 
      item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.technician.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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
      <ServiceHeader 
        viewMode={viewMode} 
        setViewMode={setViewMode}
        onExport={handleExportServices}
        onImport={handleImportServices}
        onScheduleService={handleScheduleService}
      />

      <ServiceFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
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
          onSave={handleEditService}
          onCancel={() => setEditingService(null)}
        />
      )}
    </div>
  );
}

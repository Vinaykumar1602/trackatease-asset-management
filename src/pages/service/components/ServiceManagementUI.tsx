
import React from "react";
import { ServiceItem, CalendarService } from "../types";
import { ServiceTable } from "./ServiceTable";
import { ServiceCalendarView } from "./ServiceCalendarView";
import { ServiceEditDialog } from "./ServiceEditDialog";
import { ServiceHeader } from "./ServiceHeader";
import { ServiceFilters } from "./ServiceFilters";

interface ServiceManagementUIProps {
  filteredServiceItems: ServiceItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  technicianFilter: string;
  setTechnicianFilter: (technician: string) => void;
  technicians: string[];
  viewMode: "table" | "calendar";
  serviceItems: ServiceItem[];
  scheduleService: (newService: Omit<ServiceItem, "id" | "slaStatus">) => Promise<boolean>;
  exportServices: () => void;
  onImportServices: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditService: (service: ServiceItem) => void;
  onCompleteService: (id: string) => void;
  editingService: ServiceItem | null;
  editService: (service: ServiceItem) => Promise<boolean>;
}

export function ServiceManagementUI({
  filteredServiceItems,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  technicianFilter,
  setTechnicianFilter,
  technicians,
  viewMode,
  serviceItems,
  scheduleService,
  exportServices,
  onImportServices,
  onEditService,
  onCompleteService,
  editingService,
  editService
}: ServiceManagementUIProps) {
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
          onScheduleService={scheduleService}
          onExport={exportServices}
          onImport={onImportServices}
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
            onEdit={onEditService}
            onComplete={onCompleteService}
          />
        ) : (
          <ServiceCalendarView 
            services={servicesForCalendar}
            onServiceClick={(id: string) => {
              const service = serviceItems.find(item => item.id === id);
              if (service) {
                onEditService(service);
              }
            }}
          />
        )}
      </div>

      {editingService && (
        <ServiceEditDialog
          service={editingService}
          onSave={editService}
          onCancel={() => onEditService(null)}
        />
      )}
    </div>
  );
}

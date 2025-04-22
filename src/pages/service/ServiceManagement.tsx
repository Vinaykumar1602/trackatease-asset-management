import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Wrench,
  Calendar as CalendarIcon,
  Download, 
  Upload, 
  Plus, 
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Check,
  Table as TableIcon, 
  Calendar
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ServiceRecord, ServiceRequestData } from "../sales/types";
import { ScheduleServiceDialog } from "./components/ScheduleServiceDialog";
import { ServiceEditDialog } from "./components/ServiceEditDialog";
import { ServiceCalendarView } from "./components/ServiceCalendarView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface ServiceItem {
  id: string;
  client: string;
  product: string;
  serialNo: string;
  scheduledDate: string;
  technician: string;
  status: string;
  slaStatus: string;
}

interface SalesData {
  customer_name?: string;
  product_name?: string;
  serial?: string;
  id?: string;
  quantity?: number;
  sale_date?: string;
  status?: string;
  amount?: number;
  created_at?: string;
  updated_at?: string;
}

interface CalendarService {
  id: string;
  assetId: string;
  scheduledDate: string;
  description: string;
  status: 'scheduled' | 'in progress' | 'completed' | 'cancelled' | 'pending' | 'overdue';
}

export default function ServiceManagement() {
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [serviceHistory, setServiceHistory] = useState<ServiceRecord[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");
  const [loading, setLoading] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchServiceItems();
      fetchServiceHistory();
    }
  }, [user?.id]);

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
  
  const determineSlaStatus = (scheduledDate: string, status: string): string => {
    if (!scheduledDate || status === "Completed") return "Met";
    
    const scheduled = new Date(scheduledDate);
    const today = new Date();
    
    if (status === "Overdue" || (scheduled < today && status !== "Completed")) {
      return "SLA Violated";
    }
    
    return "Within SLA";
  };
  
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
          .single();
          
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
        await handleAddServiceRecord(updatedService);
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
  
  const handleAddServiceRecord = async (service: ServiceItem) => {
    try {
      if (!user?.id) return;
      
      let saleId = null;
      
      if (service.serialNo && service.serialNo !== "N/A") {
        const { data: saleData } = await supabase
          .from('sales')
          .select('id')
          .eq('serial', service.serialNo)
          .maybeSingle();
          
        if (saleData) {
          saleId = saleData.id;
        }
      }
      
      if (!saleId) {
        const { data: serviceData } = await supabase
          .from('service_requests')
          .select('asset_id')
          .eq('id', service.id)
          .single();
          
        if (serviceData && serviceData.asset_id) {
          saleId = serviceData.asset_id;
        }
      }
      
      if (saleId) {
        await supabase
          .from('sales')
          .update({
            status: "Serviced",
            updated_at: new Date().toISOString()
          })
          .eq('id', saleId);
          
        const serviceRecord: ServiceRecord = {
          id: service.id,
          saleId: saleId,
          date: service.scheduledDate || new Date().toISOString().split('T')[0],
          technician: service.technician,
          description: `Service completed for ${service.product}`,
          partsUsed: "None",
          nextServiceDue: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0]
        };
        
        setServiceHistory(prev => [...prev, serviceRecord]);
      }
    } catch (error) {
      console.error("Error adding service record:", error);
    }
  };
  
  const handleCompleteService = async (id: string) => {
    try {
      const service = serviceItems.find(item => item.id === id);
      if (!service) return;
      
      const { error } = await supabase
        .from('service_requests')
        .update({
          status: "Completed",
          completion_date: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      const updatedService = {
        ...service,
        status: "Completed",
        slaStatus: "Met"
      };
      
      setServiceItems(prev => prev.map(item => 
        item.id === id ? updatedService : item
      ));
      
      await handleAddServiceRecord(updatedService);
      
      toast({
        title: "Service Completed",
        description: "The service has been marked as complete."
      });
    } catch (error) {
      console.error("Error completing service:", error);
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
  
  const handleViewService = (id: string) => {
    const service = serviceItems.find(item => item.id === id);
    if (service) {
      setEditingService(service);
    }
  };

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
          <p className="text-muted-foreground">Schedule and track maintenance services.</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "table" | "calendar")}>
            <TabsList>
              <TabsTrigger value="table">
                <TableIcon className="h-4 w-4 mr-2" />
                Table View
              </TabsTrigger>
              <TabsTrigger value="calendar">
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={handleExportServices}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Import
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              className="hidden"
              onChange={handleImportServices}
            />
          </Button>
          <ScheduleServiceDialog onSave={handleScheduleService} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search service records..." 
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Serial No.</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>SLA Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServiceItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                    No service records found. Schedule a new service or adjust your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredServiceItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.client}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                        <span>{item.product}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.serialNo}</TableCell>
                    <TableCell>{item.scheduledDate}</TableCell>
                    <TableCell>{item.technician}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.status === "Scheduled" ? "bg-blue-100 text-blue-800" :
                        item.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                        item.status === "Completed" ? "bg-green-100 text-green-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        {item.slaStatus === "Met" || item.slaStatus === "Within SLA" ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        )}
                        <span className="text-sm">{item.slaStatus}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingService(item)}
                      >
                        Edit
                      </Button>
                      {item.status !== "Completed" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCompleteService(item.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <ServiceCalendarView 
          services={servicesForCalendar}
          onServiceClick={(id: string) => handleViewService(id)}
        />
      )}

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

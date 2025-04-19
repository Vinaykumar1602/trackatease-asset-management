
import { useState, useRef } from "react";
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
import { ServiceRecord } from "../sales/types";
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

export interface ServiceItem {
  id: number;
  client: string;
  product: string;
  serialNo: string;
  scheduledDate: string;
  technician: string;
  status: string;
  slaStatus: string;
}

export default function ServiceManagement() {
  // State for service items
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([
    { 
      id: 1, 
      client: "ABC Corporation", 
      product: "Server System X1",
      serialNo: "SRV-X1-2023-001", 
      scheduledDate: "Jul 15, 2023",
      technician: "Mike Johnson",
      status: "Scheduled",
      slaStatus: "Within SLA"
    },
    { 
      id: 2, 
      client: "XYZ Inc", 
      product: "Network Switch N500",
      serialNo: "NSW-N500-2023-002", 
      scheduledDate: "Jul 17, 2023",
      technician: "Sarah Wilson",
      status: "Pending",
      slaStatus: "Within SLA"
    },
    { 
      id: 3, 
      client: "123 Solutions", 
      product: "Security Camera System",
      serialNo: "CAM-S1-2023-003", 
      scheduledDate: "Jul 10, 2023",
      technician: "David Brown",
      status: "Completed",
      slaStatus: "Met"
    },
    { 
      id: 4, 
      client: "City Mall", 
      product: "Digital Signage System",
      serialNo: "DSS-2022-004", 
      scheduledDate: "Jul 05, 2023",
      technician: "Unassigned",
      status: "Overdue",
      slaStatus: "SLA Violated"
    }
  ]);
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");
  
  // State for service history
  const [serviceHistory, setServiceHistory] = useState<ServiceRecord[]>([
    {
      id: 1,
      saleId: 1,
      date: "Mar 10, 2023",
      technician: "Mike Johnson",
      description: "Initial setup and configuration",
      partsUsed: "None",
      nextServiceDue: "Jun 10, 2023"
    },
    {
      id: 2,
      saleId: 1,
      date: "Jun 15, 2023",
      technician: "Mike Johnson",
      description: "Quarterly maintenance",
      partsUsed: "Cooling fan",
      nextServiceDue: "Sep 15, 2023"
    },
    {
      id: 3,
      saleId: 2,
      date: "May 10, 2023",
      technician: "Sarah Wilson",
      description: "Firmware update",
      partsUsed: "None",
      nextServiceDue: "Aug 10, 2023"
    }
  ]);
  
  // Ref for file upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  
  // Handle scheduling a new service
  const handleScheduleService = (newService: Omit<ServiceItem, 'id' | 'slaStatus'>) => {
    const id = serviceItems.length > 0 ? Math.max(...serviceItems.map(item => item.id)) + 1 : 1;
    const slaStatus = "Within SLA"; // Default for new services
    
    const serviceToAdd = { ...newService, id, slaStatus };
    setServiceItems(prev => [...prev, serviceToAdd]);
    
    toast({
      title: "Service Scheduled",
      description: `Service for ${serviceToAdd.product} has been scheduled for ${serviceToAdd.scheduledDate}.`
    });
  };
  
  // Handle editing a service
  const handleEditService = (updatedService: ServiceItem) => {
    setServiceItems(prev => prev.map(item => 
      item.id === updatedService.id ? updatedService : item
    ));
    
    // Add to history if status is changed to Completed
    if (updatedService.status === "Completed" && editingService?.status !== "Completed") {
      const historyId = serviceHistory.length > 0 
        ? Math.max(...serviceHistory.map(item => item.id)) + 1 
        : 1;
      
      const newHistoryRecord: ServiceRecord = {
        id: historyId,
        saleId: updatedService.id,
        date: updatedService.scheduledDate,
        technician: updatedService.technician,
        description: `Service completed for ${updatedService.product}`,
        partsUsed: "None", // This would be updated in the edit dialog
        nextServiceDue: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0]
      };
      
      setServiceHistory(prev => [...prev, newHistoryRecord]);
    }
    
    setEditingService(null);
    
    toast({
      title: "Service Updated",
      description: `Service details for ${updatedService.product} have been updated.`
    });
  };
  
  // Handle marking a service as complete
  const handleCompleteService = (id: number) => {
    setServiceItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: "Completed", slaStatus: "Met" } 
        : item
    ));
    
    const service = serviceItems.find(item => item.id === id);
    if (service) {
      const historyId = serviceHistory.length > 0 
        ? Math.max(...serviceHistory.map(item => item.id)) + 1 
        : 1;
      
      const newHistoryRecord: ServiceRecord = {
        id: historyId,
        saleId: service.id,
        date: new Date().toISOString().split('T')[0],
        technician: service.technician,
        description: `Service completed for ${service.product}`,
        partsUsed: "None",
        nextServiceDue: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0]
      };
      
      setServiceHistory(prev => [...prev, newHistoryRecord]);
    }
    
    toast({
      title: "Service Completed",
      description: "The service has been marked as complete."
    });
  };
  
  // Export services to CSV
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
  
  // Import services from CSV
  const handleImportServices = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim());
        const headers = rows[0].split(',');
        
        // Skip header row
        const importedServices = rows.slice(1).map(row => {
          const values = row.split(',');
          return {
            id: serviceItems.length > 0 ? Math.max(...serviceItems.map(a => a.id)) + 1 : 1,
            client: values[1] || "",
            product: values[2] || "",
            serialNo: values[3] || "",
            scheduledDate: values[4] || new Date().toISOString().split('T')[0],
            technician: values[5] || "",
            status: values[6] || "Scheduled",
            slaStatus: values[7] || "Within SLA"
          };
        });
        
        setServiceItems(prev => [...prev, ...importedServices]);
        
        toast({
          title: "Import Successful",
          description: `${importedServices.length} service records have been imported.`
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "There was an error importing the file. Please check the format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Handle view service details
  const handleViewService = (id: number) => {
    const service = serviceItems.find(item => item.id === id);
    if (service) {
      setEditingService(service);
    }
  };
  
  // Filter service items based on search query and status filter
  const filteredServiceItems = serviceItems.filter(item => {
    // Search filter
    const matchesSearch = 
      searchQuery === "" || 
      item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.technician.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Status filter
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
          serviceItems={filteredServiceItems} 
          onServiceClick={handleViewService} 
        />
      )}

      {/* Edit Service Dialog */}
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

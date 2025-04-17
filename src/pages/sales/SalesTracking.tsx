import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesTable } from "./components/SalesTable";
import { ServiceHistoryTable } from "./components/ServiceHistoryTable";
import { AddSaleDialog } from "./components/AddSaleDialog";
import { SalesItem, ServiceRecord, SaleFormData } from "./types";

export default function SalesTracking() {
  const [salesItems, setSalesItems] = useState<SalesItem[]>([
    { 
      id: 1, 
      productName: "Server System X1", 
      serialNo: "SRV-X1-2023-001", 
      client: "ABC Corporation", 
      contact: "John Smith", 
      saleDate: "Jan 15, 2023", 
      warrantyExpiry: "Jan 15, 2024",
      amcStartDate: "Jan 16, 2024",
      amcExpiryDate: "Jan 15, 2025",
      status: "Active",
      lastService: "Mar 10, 2024", 
      lastServiceNotes: "Routine maintenance, replaced cooling fans"
    },
    { 
      id: 2, 
      productName: "Network Switch N500", 
      serialNo: "NSW-N500-2023-002", 
      client: "XYZ Inc", 
      contact: "Jane Doe", 
      saleDate: "Feb 10, 2023", 
      warrantyExpiry: "Feb 10, 2024",
      amcStartDate: "Feb 11, 2024",
      amcExpiryDate: "Feb 10, 2025",
      status: "Active",
      lastService: "Apr 5, 2024",
      lastServiceNotes: "Firmware update and configuration check" 
    },
    { 
      id: 3, 
      productName: "Security Camera System", 
      serialNo: "CAM-S1-2023-003", 
      client: "123 Solutions", 
      contact: "Bob Johnson", 
      saleDate: "Mar 05, 2023", 
      warrantyExpiry: "Mar 05, 2024",
      amcStartDate: "N/A",
      amcExpiryDate: "N/A",
      status: "Warranty Only" 
    },
    { 
      id: 4, 
      productName: "Digital Signage System", 
      serialNo: "DSS-2022-004", 
      client: "City Mall", 
      contact: "Mary Williams", 
      saleDate: "Dec 12, 2022", 
      warrantyExpiry: "Dec 12, 2023",
      amcStartDate: "Dec 13, 2023",
      amcExpiryDate: "Dec 12, 2024",
      status: "Expiring Soon",
      lastService: "Jan 20, 2024",
      lastServiceNotes: "Display calibration and software update" 
    }
  ]);

  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([
    {
      id: 1,
      saleId: 1,
      date: "Mar 10, 2024",
      technician: "Mike Johnson",
      description: "Routine maintenance",
      partsUsed: "Cooling fans x2",
      nextServiceDue: "Sep 10, 2024"
    },
    {
      id: 2,
      saleId: 1,
      date: "Sep 15, 2023",
      technician: "Mike Johnson",
      description: "Quarterly system check",
      partsUsed: "None",
      nextServiceDue: "Dec 15, 2023"
    },
    {
      id: 3,
      saleId: 2,
      date: "Apr 5, 2024",
      technician: "Sarah Wilson",
      description: "Firmware update and configuration check",
      partsUsed: "None",
      nextServiceDue: "Jul 5, 2024"
    },
    {
      id: 4,
      saleId: 4,
      date: "Jan 20, 2024",
      technician: "David Brown",
      description: "Display calibration and software update",
      partsUsed: "None",
      nextServiceDue: "Apr 20, 2024"
    }
  ]);

  // State for search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewingServiceHistory, setViewingServiceHistory] = useState(false);
  const [serviceHistoryForItem, setServiceHistoryForItem] = useState<number | null>(null);

  const { toast } = useToast();

  const calculateStatus = (item: SaleFormData): string => {
    if (item.amcStartDate === "" || item.amcExpiryDate === "") {
      return "Warranty Only";
    }
    
    const today = new Date();
    const amcExpiry = new Date(item.amcExpiryDate);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);
    
    if (amcExpiry < today) {
      return "Expired";
    } else if (amcExpiry <= threeMonthsFromNow) {
      return "Expiring Soon";
    }
    return "Active";
  };

  const handleAddSale = (formData: SaleFormData) => {
    const id = salesItems.length > 0 ? Math.max(...salesItems.map(item => item.id)) + 1 : 1;
    const status = calculateStatus(formData);
    
    const newItem = { ...formData, id, status };
    setSalesItems(prev => [...prev, newItem]);
    
    toast({
      title: "Sale Added",
      description: `${newItem.productName} has been added to sales records.`
    });
  };

  const handleDeleteSale = (id: number) => {
    setSalesItems(prev => prev.filter(item => item.id !== id));
    setServiceRecords(prev => prev.filter(record => record.saleId !== id));
    
    toast({
      title: "Sale Deleted",
      description: "The sale record has been removed."
    });
  };

  const handleViewServiceHistory = (id: number) => {
    setServiceHistoryForItem(id);
    setViewingServiceHistory(true);
  };

  const exportToCSV = (type: 'sales' | 'service') => {
    let csvContent = "";
    
    if (type === 'sales') {
      csvContent = "ID,Product Name,Serial No,Client,Contact,Sale Date,Warranty Expiry,AMC Start,AMC Expiry,Status,Last Service\n";
      salesItems.forEach(item => {
        csvContent += `${item.id},"${item.productName}","${item.serialNo}","${item.client}","${item.contact}","${item.saleDate}","${item.warrantyExpiry}","${item.amcStartDate}","${item.amcExpiryDate}","${item.status}","${item.lastService || 'N/A'}"\n`;
      });
    } else {
      csvContent = "ID,Product,Serial No,Client,Date,Technician,Description,Parts Used,Next Service Due\n";
      serviceRecords.forEach(record => {
        const saleItem = salesItems.find(item => item.id === record.saleId);
        if (saleItem) {
          csvContent += `${record.id},"${saleItem.productName}","${saleItem.serialNo}","${saleItem.client}","${record.date}","${record.technician}","${record.description}","${record.partsUsed}","${record.nextServiceDue}"\n`;
        }
      });
    }
    
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", type === 'sales' ? "sales_export.csv" : "service_records_export.csv");
    document.body.appendChild(link);
    link.click();
    
    toast({
      title: "Export Successful",
      description: `${type === 'sales' ? 'Sales records' : 'Service records'} have been exported to CSV.`
    });
  };

  // Filter sales items based on search query and status filter
  const filteredSalesItems = salesItems.filter(item => 
    (searchQuery === "" || 
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === "All" || item.status === statusFilter)
  );

  // Filtered service records for a specific sale item
  const filteredServiceRecords = serviceHistoryForItem 
    ? serviceRecords.filter(record => record.saleId === serviceHistoryForItem)
    : serviceRecords;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales & AMC Tracking</h1>
          <p className="text-muted-foreground">Track sold products, warranties and maintenance contracts.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => exportToCSV('sales')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <AddSaleDialog onSave={handleAddSale} />
        </div>
      </div>

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales & AMC Records</TabsTrigger>
          <TabsTrigger value="service">Service History</TabsTrigger>
        </TabsList>
      
        <TabsContent value="sales" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search by product or client..." 
                className="pl-8 w-full" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                  <SelectItem value="Warranty Only">Warranty Only</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-md">
            <SalesTable 
              items={filteredSalesItems}
              onEdit={() => {}}
              onViewHistory={handleViewServiceHistory}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="service" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Service History Records</h3>
            <Button variant="outline" size="sm" onClick={() => exportToCSV('service')}>
              <Download className="h-4 w-4 mr-2" />
              Export Service Records
            </Button>
          </div>
          
          <div className="border rounded-md">
            <ServiceHistoryTable 
              records={filteredServiceRecords}
              salesItems={salesItems}
            />
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={viewingServiceHistory} onOpenChange={setViewingServiceHistory}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              Service History
              {serviceHistoryForItem && salesItems.find(item => item.id === serviceHistoryForItem) && (
                <span className="ml-2 font-normal text-muted-foreground">
                  {salesItems.find(item => item.id === serviceHistoryForItem)?.productName}
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              Complete service history for this product
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border rounded-md">
              <ServiceHistoryTable 
                records={filteredServiceRecords}
                compact
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

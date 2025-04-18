
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Search, Filter } from "lucide-react";
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
import { ImportDialog } from "./components/ImportDialog";
import { ProductLookup } from "./components/ProductLookup";
import { ProductDetailsDialog } from "./components/ProductDetailsDialog";
import { SalesItem, ServiceRecord, SaleFormData, ServiceFormData, ClientBranch, ImportFormat } from "./types";

// Mock client branches data
const mockClientBranches: ClientBranch[] = [
  { id: 1, clientId: 1, name: "ABC Corporation - Main Branch", code: "ABC-001", address: "123 Corporate Blvd, City" },
  { id: 2, clientId: 1, name: "ABC Corporation - North Branch", code: "ABC-002", address: "456 Business Ave, City" },
  { id: 3, clientId: 2, name: "XYZ Inc - Headquarters", code: "XYZ-001", address: "789 Market St, City" },
  { id: 4, clientId: 2, name: "XYZ Inc - South Division", code: "XYZ-002", address: "101 Commerce Rd, City" },
  { id: 5, clientId: 3, name: "123 Solutions - Main Office", code: "123-HQ", address: "202 Solution Dr, City" },
];

export default function SalesTracking() {
  const [salesItems, setSalesItems] = useState<SalesItem[]>([
    { 
      id: 1, 
      productName: "Server System X1", 
      serialNo: "SRV-X1-2023-001", 
      client: "ABC Corporation",
      clientBranch: "Main Branch",
      clientBranchCode: "ABC-001",
      contact: "John Smith", 
      saleDate: "2023-01-15", 
      warrantyExpiry: "2024-01-15",
      amcStartDate: "2024-01-16",
      amcExpiryDate: "2025-01-15",
      status: "Active",
      location: "Server Room A, HQ Building",
      lastService: "2024-03-10", 
      lastServiceNotes: "Routine maintenance, replaced cooling fans"
    },
    { 
      id: 2, 
      productName: "Network Switch N500", 
      serialNo: "NSW-N500-2023-002", 
      client: "XYZ Inc",
      clientBranch: "South Division",
      clientBranchCode: "XYZ-002", 
      contact: "Jane Doe", 
      saleDate: "2023-02-10", 
      warrantyExpiry: "2024-02-10",
      amcStartDate: "2024-02-11",
      amcExpiryDate: "2025-02-10",
      status: "Active",
      location: "Network Closet 2, Floor 3",
      lastService: "2024-04-05",
      lastServiceNotes: "Firmware update and configuration check" 
    },
    { 
      id: 3, 
      productName: "Security Camera System", 
      serialNo: "CAM-S1-2023-003", 
      client: "123 Solutions",
      clientBranch: "Main Office",
      clientBranchCode: "123-HQ", 
      contact: "Bob Johnson", 
      saleDate: "2023-03-05", 
      warrantyExpiry: "2024-03-05",
      amcStartDate: "N/A",
      amcExpiryDate: "N/A",
      status: "Warranty Only",
      location: "Entrance Lobby, Main Building" 
    },
    { 
      id: 4, 
      productName: "Digital Signage System", 
      serialNo: "DSS-2022-004", 
      client: "City Mall",
      contact: "Mary Williams", 
      saleDate: "2022-12-12", 
      warrantyExpiry: "2023-12-12",
      amcStartDate: "2023-12-13",
      amcExpiryDate: "2024-12-12",
      status: "Expiring Soon",
      location: "Central Atrium, Level 2",
      lastService: "2024-01-20",
      lastServiceNotes: "Display calibration and software update" 
    },
    { 
      id: 5, 
      productName: "Laser Printer Pro", 
      serialNo: "LP-2022-005", 
      client: "ABC Corporation",
      clientBranch: "North Branch",
      clientBranchCode: "ABC-002", 
      contact: "Rachel Green", 
      saleDate: "2022-11-08", 
      warrantyExpiry: "2023-11-08",
      amcStartDate: "2023-11-09",
      amcExpiryDate: "2023-06-15",
      status: "Product Fully Written Off",
      location: "Admin Office 301" 
    }
  ]);

  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([
    {
      id: 1,
      saleId: 1,
      date: "2024-03-10",
      technician: "Mike Johnson",
      description: "Routine maintenance",
      partsUsed: "Cooling fans x2",
      nextServiceDue: "2024-09-10",
      remarks: "System performance optimal after component replacement."
    },
    {
      id: 2,
      saleId: 1,
      date: "2023-09-15",
      technician: "Mike Johnson",
      description: "Quarterly system check",
      partsUsed: "None",
      nextServiceDue: "2023-12-15",
      remarks: "All systems functioning within normal parameters."
    },
    {
      id: 3,
      saleId: 2,
      date: "2024-04-05",
      technician: "Sarah Wilson",
      description: "Firmware update and configuration check",
      partsUsed: "None",
      nextServiceDue: "2024-07-05",
      remarks: "Updated to firmware v3.2.1. Verified all ports working correctly."
    },
    {
      id: 4,
      saleId: 4,
      date: "2024-01-20",
      technician: "David Brown",
      description: "Display calibration and software update",
      partsUsed: "None",
      nextServiceDue: "2024-04-20",
      remarks: "Calibrated color settings and corrected display brightness issues."
    }
  ]);

  // State for search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewingServiceHistory, setViewingServiceHistory] = useState(false);
  const [serviceHistoryForItem, setServiceHistoryForItem] = useState<number | null>(null);
  const [viewingProductDetails, setViewingProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SalesItem | null>(null);

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
    const status = formData.status || calculateStatus(formData);
    
    const newItem = { 
      ...formData, 
      id, 
      status
    };
    
    setSalesItems(prev => [...prev, newItem]);
    
    toast({
      title: "Sale Added",
      description: `${newItem.productName} has been added to sales records.`
    });
  };

  const handleUpdateSale = (id: number, formData: SaleFormData) => {
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

  const handleViewProductDetails = (item: SalesItem) => {
    setSelectedProduct(item);
    setViewingProductDetails(true);
  };

  const handleAddService = (formData: ServiceFormData) => {
    const id = serviceRecords.length > 0 ? Math.max(...serviceRecords.map(record => record.id)) + 1 : 1;
    const newRecord = { ...formData, id };
    
    setServiceRecords(prev => [...prev, newRecord]);
    
    // Update last service info in the related sales item
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
  };

  const handleProductSelected = (item: any) => {
    // If it's a sales item
    if ((item as SalesItem).serialNo) {
      handleViewProductDetails(item as SalesItem);
    } else {
      // If it's an asset from another module, we could convert it to a sale item
      toast({
        title: "Asset Selected",
        description: `Selected ${item.name} (${item.serial}) from Assets.`
      });
    }
  };

  const exportToCSV = (type: 'sales' | 'service') => {
    let csvContent = "";
    
    if (type === 'sales') {
      csvContent = "ID,Product Name,Serial No,Client,Branch,Branch Code,Contact,Sale Date,Warranty Expiry,AMC Start,AMC Expiry,Status,Location,Last Service\n";
      salesItems.forEach(item => {
        csvContent += `${item.id},"${item.productName}","${item.serialNo}","${item.client}","${item.clientBranch || ''}","${item.clientBranchCode || ''}","${item.contact}","${item.saleDate}","${item.warrantyExpiry}","${item.amcStartDate}","${item.amcExpiryDate}","${item.status}","${item.location || ''}","${item.lastService || 'N/A'}"\n`;
      });
    } else {
      csvContent = "ID,Product,Serial No,Client,Date,Technician,Description,Parts Used,Next Service Due,Remarks\n";
      serviceRecords.forEach(record => {
        const saleItem = salesItems.find(item => item.id === record.saleId);
        if (saleItem) {
          csvContent += `${record.id},"${saleItem.productName}","${saleItem.serialNo}","${saleItem.client}","${record.date}","${record.technician}","${record.description}","${record.partsUsed}","${record.nextServiceDue}","${record.remarks || ''}"\n`;
        }
      });
    }
    
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", type === 'sales' ? "sales_export.csv" : "service_records_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: `${type === 'sales' ? 'Sales records' : 'Service records'} have been exported to CSV.`
    });
  };

  const handleImportComplete = (data: ImportFormat[], type: 'sales' | 'service') => {
    if (type === 'sales') {
      // Process and add sales data
      const newSales = data.map((item, index) => {
        const maxId = salesItems.length > 0 ? Math.max(...salesItems.map(s => s.id)) : 0;
        return {
          id: maxId + index + 1,
          productName: item.productName || 'Unknown Product',
          serialNo: item.serialNo || `IMPORT-${Date.now()}-${index}`,
          client: item.client || 'Unknown Client',
          clientBranch: item.clientBranch || undefined,
          clientBranchCode: item.clientBranchCode || undefined,
          contact: item.contact || '',
          saleDate: item.saleDate || new Date().toISOString().split('T')[0],
          warrantyExpiry: item.warrantyExpiry || '',
          amcStartDate: item.amcStartDate || 'N/A',
          amcExpiryDate: item.amcExpiryDate || 'N/A',
          status: item.status || 'Active',
          location: item.location || undefined
        };
      });
      
      setSalesItems(prev => [...prev, ...newSales]);
    } else {
      // Process and add service data
      const newServices = data.map((item, index) => {
        const maxId = serviceRecords.length > 0 ? Math.max(...serviceRecords.map(s => s.id)) : 0;
        return {
          id: maxId + index + 1,
          saleId: parseInt(item.saleId) || 1,
          date: item.date || new Date().toISOString().split('T')[0],
          technician: item.technician || 'Unknown',
          description: item.description || 'Service visit',
          partsUsed: item.partsUsed || '',
          nextServiceDue: item.nextServiceDue || '',
          remarks: item.remarks || ''
        };
      });
      
      setServiceRecords(prev => [...prev, ...newServices]);
      
      // Update last service info in the related sales items
      setSalesItems(prev => prev.map(item => {
        const latestService = [...serviceRecords, ...newServices]
          .filter(s => s.saleId === item.id)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
          
        if (latestService) {
          return {
            ...item,
            lastService: latestService.date,
            lastServiceNotes: latestService.description
          };
        }
        return item;
      }));
    }
    
    toast({
      title: "Import Successful",
      description: `${data.length} ${type} records have been imported.`
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
          <ImportDialog 
            type="sales" 
            onImportComplete={(data) => handleImportComplete(data, 'sales')} 
          />
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
            <ProductLookup 
              salesItems={salesItems}
              onSelect={handleProductSelected}
            />
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
                  <SelectItem value="Product Fully Written Off">Product Fully Written Off</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-md">
            <SalesTable 
              items={filteredSalesItems}
              onEdit={() => {}}
              onViewHistory={handleViewServiceHistory}
              onDelete={handleDeleteSale}
              onUpdate={handleUpdateSale}
              clientBranches={mockClientBranches}
              onView={handleViewProductDetails}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="service" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Service History Records</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => exportToCSV('service')}>
                <Download className="h-4 w-4 mr-2" />
                Export Records
              </Button>
              <ImportDialog 
                type="service" 
                onImportComplete={(data) => handleImportComplete(data, 'service')} 
              />
            </div>
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

      <ProductDetailsDialog
        isOpen={viewingProductDetails}
        onClose={() => setViewingProductDetails(false)}
        item={selectedProduct}
        serviceRecords={serviceRecords}
      />
    </div>
  );
}

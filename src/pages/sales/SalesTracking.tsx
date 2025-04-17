
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Download, 
  Upload, 
  Plus, 
  Search,
  Filter,
  AlertTriangle,
  Trash2,
  FileText,
  Edit
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SalesItem {
  id: number;
  productName: string;
  serialNo: string;
  client: string;
  contact: string;
  saleDate: string;
  warrantyExpiry: string;
  amcStartDate: string;
  amcExpiryDate: string;
  status: string;
  lastService?: string;
  lastServiceNotes?: string;
}

interface ServiceRecord {
  id: number;
  saleId: number;
  date: string;
  technician: string;
  description: string;
  partsUsed: string;
  nextServiceDue: string;
}

export default function SalesTracking() {
  // State for sales data
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

  // Service records data
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

  // State for new sales item
  const [newSaleItem, setNewSaleItem] = useState<Omit<SalesItem, 'id' | 'status'>>({
    productName: "",
    serialNo: "",
    client: "",
    contact: "",
    saleDate: "",
    warrantyExpiry: "",
    amcStartDate: "",
    amcExpiryDate: "",
  });

  // State for new service record
  const [newServiceRecord, setNewServiceRecord] = useState<Omit<ServiceRecord, 'id'>>({
    saleId: 0,
    date: new Date().toISOString().split('T')[0],
    technician: "",
    description: "",
    partsUsed: "",
    nextServiceDue: ""
  });

  // State for editing
  const [editingSaleId, setEditingSaleId] = useState<number | null>(null);
  const [editingSale, setEditingSale] = useState<Omit<SalesItem, 'id' | 'status'>>({
    productName: "",
    serialNo: "",
    client: "",
    contact: "",
    saleDate: "",
    warrantyExpiry: "",
    amcStartDate: "",
    amcExpiryDate: "",
  });

  // State for search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // State for dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);
  const [viewingServiceHistory, setViewingServiceHistory] = useState(false);
  const [serviceHistoryForItem, setServiceHistoryForItem] = useState<number | null>(null);

  const { toast } = useToast();

  // Form handler for sales
  const handleSaleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSaleItem(prev => ({ ...prev, [name]: value }));
  };

  // Form handler for editing sales
  const handleEditSaleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingSale(prev => ({ ...prev, [name]: value }));
  };

  // Form handler for service
  const handleServiceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewServiceRecord(prev => ({ ...prev, [name]: value }));
  };
  
  // Select handler
  const handleSelectChange = (name: string, value: string) => {
    setNewSaleItem(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSelectChange = (name: string, value: string) => {
    setEditingSale(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceSelectChange = (name: string, value: string) => {
    setNewServiceRecord(prev => ({ ...prev, [name]: value }));
  };
  
  // Add new sale
  const handleAddSale = () => {
    const id = salesItems.length > 0 ? Math.max(...salesItems.map(item => item.id)) + 1 : 1;
    
    // Calculate status
    let status = "Active";
    if (newSaleItem.amcStartDate === "N/A" || newSaleItem.amcStartDate === "") {
      status = "Warranty Only";
    } else {
      const today = new Date();
      const amcExpiry = new Date(newSaleItem.amcExpiryDate);
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(today.getMonth() + 3);
      
      if (amcExpiry < today) {
        status = "Expired";
      } else if (amcExpiry <= threeMonthsFromNow) {
        status = "Expiring Soon";
      }
    }
    
    const newItem = { ...newSaleItem, id, status };
    
    setSalesItems(prev => [...prev, newItem]);
    setIsAddDialogOpen(false);
    
    // Reset form
    setNewSaleItem({
      productName: "",
      serialNo: "",
      client: "",
      contact: "",
      saleDate: "",
      warrantyExpiry: "",
      amcStartDate: "",
      amcExpiryDate: "",
    });
    
    toast({
      title: "Sale Added",
      description: `${newItem.productName} has been added to sales records.`
    });
  };

  // Update sale
  const handleEditSale = () => {
    if (!editingSaleId) return;

    // Calculate status
    let status = "Active";
    if (editingSale.amcStartDate === "N/A" || editingSale.amcStartDate === "") {
      status = "Warranty Only";
    } else {
      const today = new Date();
      const amcExpiry = new Date(editingSale.amcExpiryDate);
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(today.getMonth() + 3);
      
      if (amcExpiry < today) {
        status = "Expired";
      } else if (amcExpiry <= threeMonthsFromNow) {
        status = "Expiring Soon";
      }
    }
    
    setSalesItems(prev => prev.map(item => 
      item.id === editingSaleId 
        ? { ...item, ...editingSale, status } 
        : item
    ));
    
    setIsEditDialogOpen(false);
    setEditingSaleId(null);
    
    toast({
      title: "Sale Updated",
      description: `${editingSale.productName} has been updated.`
    });
  };

  // Delete sale
  const handleDeleteSale = (id: number) => {
    setSalesItems(prev => prev.filter(item => item.id !== id));
    
    // Also delete associated service records
    setServiceRecords(prev => prev.filter(record => record.saleId !== id));
    
    toast({
      title: "Sale Deleted",
      description: "The sale record has been removed."
    });
  };

  // Add new service record
  const handleAddServiceRecord = () => {
    const id = serviceRecords.length > 0 ? Math.max(...serviceRecords.map(record => record.id)) + 1 : 1;
    const newRecord = { ...newServiceRecord, id };
    
    setServiceRecords(prev => [...prev, newRecord]);
    
    // Update the last service information in the sales item
    setSalesItems(prev => prev.map(item => 
      item.id === newServiceRecord.saleId 
        ? { 
            ...item, 
            lastService: newServiceRecord.date,
            lastServiceNotes: newServiceRecord.description
          } 
        : item
    ));
    
    setIsServiceDialogOpen(false);
    
    // Reset form
    setNewServiceRecord({
      saleId: 0,
      date: new Date().toISOString().split('T')[0],
      technician: "",
      description: "",
      partsUsed: "",
      nextServiceDue: ""
    });
    
    toast({
      title: "Service Record Added",
      description: `Service record for ${salesItems.find(item => item.id === newServiceRecord.saleId)?.productName} has been added.`
    });
  };

  // Start editing a sale
  const handleStartEdit = (item: SalesItem) => {
    setEditingSaleId(item.id);
    setEditingSale({
      productName: item.productName,
      serialNo: item.serialNo,
      client: item.client,
      contact: item.contact,
      saleDate: item.saleDate,
      warrantyExpiry: item.warrantyExpiry,
      amcStartDate: item.amcStartDate === "N/A" ? "" : item.amcStartDate,
      amcExpiryDate: item.amcExpiryDate === "N/A" ? "" : item.amcExpiryDate,
    });
    setIsEditDialogOpen(true);
  };

  // View service history for a sale
  const handleViewServiceHistory = (id: number) => {
    setServiceHistoryForItem(id);
    setViewingServiceHistory(true);
  };

  // Export to Excel (CSV)
  const exportToCSV = (type: 'sales' | 'service') => {
    let csvContent = "";
    
    if (type === 'sales') {
      // Create header row
      csvContent = "ID,Product Name,Serial No,Client,Contact,Sale Date,Warranty Expiry,AMC Start,AMC Expiry,Status,Last Service\n";
      
      // Add data rows
      salesItems.forEach(item => {
        csvContent += `${item.id},"${item.productName}","${item.serialNo}","${item.client}","${item.contact}","${item.saleDate}","${item.warrantyExpiry}","${item.amcStartDate}","${item.amcExpiryDate}","${item.status}","${item.lastService || 'N/A'}"\n`;
      });
    } else {
      // Create header row for service records
      csvContent = "ID,Product,Serial No,Client,Date,Technician,Description,Parts Used,Next Service Due\n";
      
      // Add data rows for service records
      serviceRecords.forEach(record => {
        const saleItem = salesItems.find(item => item.id === record.saleId);
        if (saleItem) {
          csvContent += `${record.id},"${saleItem.productName}","${saleItem.serialNo}","${saleItem.client}","${record.date}","${record.technician}","${record.description}","${record.partsUsed}","${record.nextServiceDue}"\n`;
        }
      });
    }
    
    // Create download link
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", type === 'sales' ? "sales_export.csv" : "service_records_export.csv");
    document.body.appendChild(link);
    
    // Download it
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
    : [];

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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Sale
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Sale Record</DialogTitle>
                <DialogDescription>
                  Enter the details for the new sale item. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      name="productName"
                      value={newSaleItem.productName}
                      onChange={handleSaleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serialNo">Serial Number</Label>
                    <Input
                      id="serialNo"
                      name="serialNo"
                      value={newSaleItem.serialNo}
                      onChange={handleSaleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Client Name</Label>
                    <Input
                      id="client"
                      name="client"
                      value={newSaleItem.client}
                      onChange={handleSaleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Person</Label>
                    <Input
                      id="contact"
                      name="contact"
                      value={newSaleItem.contact}
                      onChange={handleSaleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="saleDate">Sale Date</Label>
                    <Input
                      id="saleDate"
                      name="saleDate"
                      type="date"
                      value={newSaleItem.saleDate}
                      onChange={handleSaleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
                    <Input
                      id="warrantyExpiry"
                      name="warrantyExpiry"
                      type="date"
                      value={newSaleItem.warrantyExpiry}
                      onChange={handleSaleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amcStartDate">AMC Start Date</Label>
                    <Input
                      id="amcStartDate"
                      name="amcStartDate"
                      type="date"
                      value={newSaleItem.amcStartDate}
                      onChange={handleSaleInputChange}
                      placeholder="Leave empty for N/A"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amcExpiryDate">AMC Expiry Date</Label>
                    <Input
                      id="amcExpiryDate"
                      name="amcExpiryDate"
                      type="date"
                      value={newSaleItem.amcExpiryDate}
                      onChange={handleSaleInputChange}
                      placeholder="Leave empty for N/A"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddSale}>Save Sale Record</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Serial No.</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Sale Date</TableHead>
                  <TableHead>Warranty Expiry</TableHead>
                  <TableHead>AMC Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Service</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSalesItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center p-4 text-muted-foreground">
                      No records found. Add a new sale record to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSalesItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                          <span>{item.productName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.serialNo}</TableCell>
                      <TableCell>
                        <div>
                          <p>{item.client}</p>
                          <p className="text-xs text-muted-foreground">{item.contact}</p>
                        </div>
                      </TableCell>
                      <TableCell>{item.saleDate}</TableCell>
                      <TableCell>{item.warrantyExpiry}</TableCell>
                      <TableCell>
                        {item.amcStartDate === "N/A" ? "No AMC" : `${item.amcStartDate} - ${item.amcExpiryDate}`}
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${
                          item.status === "Active" ? "bg-green-100 text-green-800" :
                          item.status === "Expiring Soon" ? "bg-yellow-100 text-yellow-800" :
                          item.status === "Warranty Only" ? "bg-blue-100 text-blue-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {item.status === "Expiring Soon" && <AlertTriangle className="h-3 w-3" />}
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.lastService ? (
                          <div>
                            <p className="text-sm">{item.lastService}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">{item.lastServiceNotes}</p>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No records</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewServiceHistory(item.id)}>
                          <FileText className="h-4 w-4 mr-1" />
                          History
                        </Button>
                        
                        <Dialog open={isServiceDialogOpen && selectedSaleId === item.id} onOpenChange={(open) => {
                          setIsServiceDialogOpen(open);
                          if (!open) setSelectedSaleId(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => {
                              setSelectedSaleId(item.id);
                              setNewServiceRecord(prev => ({...prev, saleId: item.id}));
                            }}>
                              Add Service
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Add Service Record</DialogTitle>
                              <DialogDescription>
                                Record service details for {item.productName} ({item.serialNo})
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="date">Service Date</Label>
                                  <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={newServiceRecord.date}
                                    onChange={handleServiceInputChange}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="technician">Technician</Label>
                                  <Input
                                    id="technician"
                                    name="technician"
                                    value={newServiceRecord.technician}
                                    onChange={handleServiceInputChange}
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="description">Service Description</Label>
                                <Input
                                  id="description"
                                  name="description"
                                  value={newServiceRecord.description}
                                  onChange={handleServiceInputChange}
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="partsUsed">Parts Used</Label>
                                  <Input
                                    id="partsUsed"
                                    name="partsUsed"
                                    value={newServiceRecord.partsUsed}
                                    onChange={handleServiceInputChange}
                                    placeholder="None"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="nextServiceDue">Next Service Due</Label>
                                  <Input
                                    id="nextServiceDue"
                                    name="nextServiceDue"
                                    type="date"
                                    value={newServiceRecord.nextServiceDue}
                                    onChange={handleServiceInputChange}
                                  />
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" onClick={handleAddServiceRecord}>Save Service Record</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="ghost" size="sm" onClick={() => handleStartEdit(item)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the sale record for {item.productName} and all associated service history.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteSale(item.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Service Date</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Parts Used</TableHead>
                  <TableHead>Next Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center p-4 text-muted-foreground">
                      No service records found. Add service records to products to see them here.
                    </TableCell>
                  </TableRow>
                ) : (
                  serviceRecords.map((record) => {
                    const saleItem = salesItems.find(item => item.id === record.saleId);
                    if (!saleItem) return null;
                    
                    return (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <p>{saleItem.productName}</p>
                            <p className="text-xs text-muted-foreground">{saleItem.serialNo}</p>
                          </div>
                        </TableCell>
                        <TableCell>{saleItem.client}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.technician}</TableCell>
                        <TableCell>{record.description}</TableCell>
                        <TableCell>{record.partsUsed || "None"}</TableCell>
                        <TableCell>{record.nextServiceDue}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Service History Dialog */}
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Parts Used</TableHead>
                    <TableHead>Next Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServiceRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center p-4 text-muted-foreground">
                        No service records found for this product.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredServiceRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.technician}</TableCell>
                        <TableCell>{record.description}</TableCell>
                        <TableCell>{record.partsUsed || "None"}</TableCell>
                        <TableCell>{record.nextServiceDue}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Sale Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Sale Record</DialogTitle>
            <DialogDescription>
              Update the details for this sale record.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-productName">Product Name</Label>
                <Input
                  id="edit-productName"
                  name="productName"
                  value={editingSale.productName}
                  onChange={handleEditSaleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-serialNo">Serial Number</Label>
                <Input
                  id="edit-serialNo"
                  name="serialNo"
                  value={editingSale.serialNo}
                  onChange={handleEditSaleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-client">Client Name</Label>
                <Input
                  id="edit-client"
                  name="client"
                  value={editingSale.client}
                  onChange={handleEditSaleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contact">Contact Person</Label>
                <Input
                  id="edit-contact"
                  name="contact"
                  value={editingSale.contact}
                  onChange={handleEditSaleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-saleDate">Sale Date</Label>
                <Input
                  id="edit-saleDate"
                  name="saleDate"
                  type="date"
                  value={editingSale.saleDate}
                  onChange={handleEditSaleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-warrantyExpiry">Warranty Expiry</Label>
                <Input
                  id="edit-warrantyExpiry"
                  name="warrantyExpiry"
                  type="date"
                  value={editingSale.warrantyExpiry}
                  onChange={handleEditSaleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-amcStartDate">AMC Start Date</Label>
                <Input
                  id="edit-amcStartDate"
                  name="amcStartDate"
                  type="date"
                  value={editingSale.amcStartDate}
                  onChange={handleEditSaleInputChange}
                  placeholder="Leave empty for N/A"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-amcExpiryDate">AMC Expiry Date</Label>
                <Input
                  id="edit-amcExpiryDate"
                  name="amcExpiryDate"
                  type="date"
                  value={editingSale.amcExpiryDate}
                  onChange={handleEditSaleInputChange}
                  placeholder="Leave empty for N/A"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleEditSale}>Update Sale</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

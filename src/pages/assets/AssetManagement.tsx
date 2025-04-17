
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Package2, 
  Download, 
  Upload, 
  Plus, 
  Search,
  Filter,
  QrCode,
  CheckCircle,
  XCircle
} from "lucide-react";
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
import { AssetFilters } from "./components/AssetFilters";
import { QrScanDialog } from "./components/QrScanDialog";
import { AssetEditDialog } from "./components/AssetEditDialog";
import { Asset } from "./types";

export default function AssetManagement() {
  // State for asset data
  const [assets, setAssets] = useState<Asset[]>([
    { id: 1, name: "Desktop Computer", category: "IT Equipment", serial: "COMP-2023-001", location: "Main Office", assignedTo: "John Smith", status: "Active" },
    { id: 2, name: "Printer X500", category: "Office Equipment", serial: "PRINT-2023-002", location: "Finance Dept", assignedTo: "Finance Team", status: "Under Repair" },
    { id: 3, name: "Server Rack", category: "IT Infrastructure", serial: "SRV-2023-003", location: "Server Room", assignedTo: "IT Department", status: "Active" },
    { id: 4, name: "HVAC System", category: "Building Equipment", serial: "HVAC-2022-004", location: "Building A", assignedTo: "Facilities", status: "Active" },
    { id: 5, name: "Company Car", category: "Vehicles", serial: "CAR-2023-005", location: "Parking Lot", assignedTo: "Sales Team", status: "Active" }
  ]);
  
  // State for new asset form
  const [newAsset, setNewAsset] = useState<Omit<Asset, 'id'>>({
    name: "",
    category: "IT Equipment",
    serial: "",
    location: "",
    assignedTo: "",
    status: "Active"
  });
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [locationFilter, setLocationFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);
  
  // State for dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  
  // Ref for file upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  
  // Form handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAsset(prev => ({ ...prev, [name]: value }));
  };
  
  // Select handler
  const handleSelectChange = (name: string, value: string) => {
    setNewAsset(prev => ({ ...prev, [name]: value }));
  };
  
  // Add new asset
  const handleAddAsset = () => {
    // Validate required fields
    if (!newAsset.name || !newAsset.serial) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const id = assets.length > 0 ? Math.max(...assets.map(a => a.id)) + 1 : 1;
    const assetToAdd = { ...newAsset, id };
    
    setAssets(prev => [...prev, assetToAdd]);
    setIsDialogOpen(false);
    
    // Reset form
    setNewAsset({
      name: "",
      category: "IT Equipment",
      serial: "",
      location: "",
      assignedTo: "",
      status: "Active"
    });
    
    toast({
      title: "Asset Added",
      description: `${assetToAdd.name} has been added to your assets.`
    });
  };
  
  // Edit asset
  const handleEditAsset = (updatedAsset: Asset) => {
    setAssets(prev => prev.map(asset => 
      asset.id === updatedAsset.id ? updatedAsset : asset
    ));
    
    setEditingAsset(null);
    
    toast({
      title: "Asset Updated",
      description: `${updatedAsset.name} has been updated.`
    });
  };
  
  // Delete asset
  const handleDeleteAsset = (id: number) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
    
    toast({
      title: "Asset Deleted",
      description: "The asset has been removed from your inventory."
    });
  };
  
  // Export assets to CSV
  const handleExportAssets = () => {
    const headers = ["ID", "Name", "Category", "Serial", "Location", "Assigned To", "Status"];
    const csvContent = [
      headers.join(','),
      ...filteredAssets.map(asset => 
        [asset.id, asset.name, asset.category, asset.serial, asset.location, asset.assignedTo, asset.status].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "assets.csv");
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Assets have been exported to CSV."
    });
  };
  
  // Import assets from CSV
  const handleImportAssets = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim());
        const headers = rows[0].split(',');
        
        // Skip header row
        const importedAssets = rows.slice(1).map(row => {
          const values = row.split(',');
          return {
            id: assets.length > 0 ? Math.max(...assets.map(a => a.id)) + 1 : 1,
            name: values[1] || "",
            category: values[2] || "IT Equipment",
            serial: values[3] || "",
            location: values[4] || "",
            assignedTo: values[5] || "",
            status: values[6] || "Active"
          };
        });
        
        setAssets(prev => [...prev, ...importedAssets]);
        
        toast({
          title: "Import Successful",
          description: `${importedAssets.length} assets have been imported.`
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
  
  // Handle QR code scan result
  const handleQrCodeScan = (serial: string) => {
    const foundAsset = assets.find(asset => asset.serial === serial);
    if (foundAsset) {
      setEditingAsset(foundAsset);
      toast({
        title: "Asset Found",
        description: `Found asset: ${foundAsset.name}`
      });
    } else {
      toast({
        title: "Asset Not Found",
        description: `No asset found with serial number: ${serial}`,
        variant: "destructive"
      });
    }
  };
  
  // Filter assets based on search query and filters
  const filteredAssets = assets.filter(asset => {
    // Search filter
    const matchesSearch = 
      searchQuery === "" || 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Category filter
    const matchesCategory = categoryFilter === "All" || asset.category === categoryFilter;
    
    // Status filter
    const matchesStatus = statusFilter === "All" || asset.status === statusFilter;
    
    // Location filter
    const matchesLocation = locationFilter === "All" || asset.location === locationFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fixed Assets</h1>
          <p className="text-muted-foreground">Manage your company's fixed assets.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportAssets}>
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
              onChange={handleImportAssets}
            />
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
                <DialogDescription>
                  Enter the details for the new asset. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name*</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newAsset.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">Category</Label>
                  <Select
                    value={newAsset.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                      <SelectItem value="Office Equipment">Office Equipment</SelectItem>
                      <SelectItem value="IT Infrastructure">IT Infrastructure</SelectItem>
                      <SelectItem value="Building Equipment">Building Equipment</SelectItem>
                      <SelectItem value="Vehicles">Vehicles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="serial" className="text-right">Serial No.*</Label>
                  <Input
                    id="serial"
                    name="serial"
                    value={newAsset.serial}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={newAsset.location}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="assignedTo" className="text-right">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    name="assignedTo"
                    value={newAsset.assignedTo}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <Select
                    value={newAsset.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Under Repair">Under Repair</SelectItem>
                      <SelectItem value="Written Off">Written Off</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddAsset}>Save Asset</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search assets..." 
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? "Hide Filters" : "Filter"}
          </Button>
          
          <QrScanDialog onScan={handleQrCodeScan} />
        </div>
      </div>

      {showFilters && (
        <AssetFilters 
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
          assets={assets}
        />
      )}

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Serial No.</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No assets found. Add a new asset or adjust your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package2 className="h-4 w-4 text-muted-foreground" />
                      <span>{asset.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>{asset.serial}</TableCell>
                  <TableCell>{asset.location}</TableCell>
                  <TableCell>{asset.assignedTo}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      asset.status === "Active" ? "bg-green-100 text-green-800" :
                      asset.status === "Under Repair" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {asset.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setEditingAsset(asset)}
                    >
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Asset Dialog */}
      {editingAsset && (
        <AssetEditDialog
          asset={editingAsset}
          onSave={handleEditAsset}
          onDelete={handleDeleteAsset}
          onCancel={() => setEditingAsset(null)}
        />
      )}
    </div>
  );
}

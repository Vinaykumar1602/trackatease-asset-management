
import { useState } from "react";
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
  QrCode
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

interface Asset {
  id: number;
  name: string;
  category: string;
  serial: string;
  location: string;
  assignedTo: string;
  status: string;
}

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
  
  // State for search
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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
  
  // Filter assets based on search query
  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fixed Assets</h1>
          <p className="text-muted-foreground">Manage your company's fixed assets.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
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
                  <Label htmlFor="name" className="text-right">Name</Label>
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
                  <Label htmlFor="serial" className="text-right">Serial No.</Label>
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
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <QrCode className="h-4 w-4 mr-2" />
            Scan QR
          </Button>
        </div>
      </div>

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
            {filteredAssets.map((asset) => (
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
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

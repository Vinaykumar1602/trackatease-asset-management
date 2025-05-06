
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Loader2
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
import { AssetViewDialog } from "./components/AssetViewDialog";
import { Asset } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface SupabaseAsset {
  id: string;
  name: string;
  category: string;
  serial: string;
  location: string;
  assigned_to: string;
  status: string;
  qr_code_url?: string;
  purchase_date?: string;
  purchase_value?: number;
  current_value?: number;
  last_maintenance?: string;
  next_maintenance?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export default function AssetManagement() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  
  const [newAsset, setNewAsset] = useState<Omit<Asset, 'id'>>({
    name: "",
    category: "IT Equipment",
    serial: "",
    location: "",
    assignedTo: "",
    status: "Active"
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [locationFilter, setLocationFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [viewingAsset, setViewingAsset] = useState<Asset | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const { data: supabaseAssets, isLoading, error } = useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assets')
        .select('*');
        
      if (error) {
        throw error;
      }
      
      return data as SupabaseAsset[];
    }
  });
  
  const assets: Asset[] = (supabaseAssets || []).map(asset => ({
    id: asset.id,  // Using string ID directly
    name: asset.name,
    category: asset.category,
    serial: asset.serial || "",
    location: asset.location || "",
    assignedTo: asset.assigned_to || "",
    status: asset.status,
    qrCodeUrl: asset.qr_code_url,
    purchaseDate: asset.purchase_date,
    purchaseValue: asset.purchase_value,
    currentValue: asset.current_value,
    lastMaintenance: asset.last_maintenance,
    nextMaintenance: asset.next_maintenance,
    supabaseId: asset.id
  }));

  const addAssetMutation = useMutation({
    mutationFn: async (asset: Omit<Asset, 'id'>) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('assets')
        .insert({
          name: asset.name,
          category: asset.category,
          serial: asset.serial,
          location: asset.location,
          assigned_to: asset.assignedTo,
          status: asset.status,
          qr_code_url: asset.qrCodeUrl,
          purchase_date: asset.purchaseDate,
          purchase_value: asset.purchaseValue,
          current_value: asset.currentValue,
          last_maintenance: asset.lastMaintenance,
          next_maintenance: asset.nextMaintenance,
          created_by: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      setIsDialogOpen(false);
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
        description: "The asset has been added successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to add asset: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const editAssetMutation = useMutation({
    mutationFn: async (asset: Asset) => {
      const { data, error } = await supabase
        .from('assets')
        .update({
          name: asset.name,
          category: asset.category,
          serial: asset.serial,
          location: asset.location,
          assigned_to: asset.assignedTo,
          status: asset.status,
          qr_code_url: asset.qrCodeUrl,
          purchase_date: asset.purchaseDate,
          purchase_value: asset.purchaseValue,
          current_value: asset.currentValue,
          last_maintenance: asset.lastMaintenance,
          next_maintenance: asset.nextMaintenance,
          updated_at: new Date().toISOString()
        })
        .eq('id', asset.supabaseId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      setEditingAsset(null);
      toast({
        title: "Asset Updated",
        description: "The asset has been updated successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update asset: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const deleteAssetMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      setEditingAsset(null);
      toast({
        title: "Asset Deleted",
        description: "The asset has been deleted successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete asset: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const canManageAssets = profile?.role === 'admin' || profile?.role === 'inventory_manager';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAsset(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewAsset(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAsset = () => {
    if (!newAsset.name || !newAsset.serial) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    addAssetMutation.mutate(newAsset);
  };

  const handleEditAsset = (updatedAsset: Asset) => {
    editAssetMutation.mutate(updatedAsset);
  };

  const handleDeleteAsset = (supabaseId: string) => {
    if (!supabaseId) {
      toast({
        title: "Error",
        description: "Cannot delete asset without valid ID.",
        variant: "destructive"
      });
      return;
    }
    
    deleteAssetMutation.mutate(supabaseId);
  };

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

  const handleImportAssets = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim());
        const headers = rows[0].split(',');
        
        const importedAssets = rows.slice(1).map(row => {
          const values = row.split(',');
          return {
            name: values[1] || "",
            category: values[2] || "IT Equipment",
            serial: values[3] || "",
            location: values[4] || "",
            assigned_to: values[5] || "",
            status: values[6] || "Active",
            created_by: user.id
          };
        });
        
        const { data, error } = await supabase
          .from('assets')
          .insert(importedAssets)
          .select();
          
        if (error) {
          throw error;
        }
        
        queryClient.invalidateQueries({ queryKey: ['assets'] });
        
        toast({
          title: "Import Successful",
          description: `${importedAssets.length} assets have been imported.`
        });
      } catch (error: any) {
        toast({
          title: "Import Failed",
          description: error.message || "There was an error importing the file.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      searchQuery === "" || 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter === "All" || asset.category === categoryFilter;
    
    const matchesStatus = statusFilter === "All" || asset.status === statusFilter;
    
    const matchesLocation = locationFilter === "All" || asset.location === locationFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <p className="text-red-500 text-center mb-4">Error loading assets: {(error as Error).message}</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['assets'] })}>
          Retry
        </Button>
      </div>
    );
  }

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
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={!canManageAssets}>
            <Upload className="h-4 w-4 mr-2" />
            Import
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              className="hidden"
              onChange={handleImportAssets}
              disabled={!canManageAssets}
            />
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" disabled={!canManageAssets}>
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading assets...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredAssets.length === 0 ? (
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
                      disabled={!canManageAssets}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setViewingAsset(asset)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingAsset && (
        <AssetEditDialog
          asset={editingAsset}
          onSave={handleEditAsset}
          onDelete={() => handleDeleteAsset(editingAsset.supabaseId!)}
          onCancel={() => setEditingAsset(null)}
        />
      )}

      {viewingAsset && (
        <AssetViewDialog
          asset={viewingAsset}
          onClose={() => setViewingAsset(null)}
        />
      )}
    </div>
  );
}

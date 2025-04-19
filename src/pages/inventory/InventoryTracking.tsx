
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Download, 
  Upload, 
  Plus, 
  Search,
  Filter,
  AlertTriangle
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
import { StockOperations } from "./components/StockOperations";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minLevel: number;
  location: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

export default function InventoryTracking() {
  // State for inventory items
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { id: 1, name: "Printer Ink Cartridge", sku: "INK-2023-001", category: "Office Supplies", quantity: 45, minLevel: 10, location: "Main Office", status: "In Stock" },
    { id: 2, name: "Toner Cartridge", sku: "TNR-2023-002", category: "Office Supplies", quantity: 8, minLevel: 10, location: "Main Office", status: "Low Stock" },
    { id: 3, name: "A4 Paper (Box)", sku: "PPR-2023-003", category: "Office Supplies", quantity: 25, minLevel: 5, location: "Storage Room", status: "In Stock" },
    { id: 4, name: "Network Cable CAT6", sku: "NET-2023-004", category: "IT Supplies", quantity: 120, minLevel: 20, location: "IT Storage", status: "In Stock" },
    { id: 5, name: "Laptop Cooling Pad", sku: "LCP-2023-005", category: "IT Equipment", quantity: 3, minLevel: 5, location: "Main Office", status: "Low Stock" }
  ]);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const { toast } = useToast();
  
  // Get unique locations
  const locations = ["All", ...new Set(inventoryItems.map(item => item.location))];
  
  // Get unique categories
  const categories = ["All", ...new Set(inventoryItems.map(item => item.category))];

  // Handle stock operations (in/out)
  const handleStockUpdate = (id: number, quantity: number, operation: "in" | "out", notes: string) => {
    setInventoryItems(prev => prev.map(item => {
      if (item.id === id) {
        // Calculate new quantity
        const newQuantity = operation === "in" 
          ? item.quantity + quantity 
          : Math.max(0, item.quantity - quantity);
        
        // Determine status based on new quantity and min level
        let newStatus: "In Stock" | "Low Stock" | "Out of Stock" = "In Stock";
        if (newQuantity === 0) {
          newStatus = "Out of Stock";
        } else if (newQuantity <= item.minLevel) {
          newStatus = "Low Stock";
        }
        
        return {
          ...item,
          quantity: newQuantity,
          status: newStatus
        };
      }
      return item;
    }));
    
    // Log this activity (in a real app, would send to server)
    console.log(`Stock ${operation}: Item ID ${id}, Quantity ${quantity}, Notes: ${notes}`);
  };

  // Filter items based on search query and filters
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = locationFilter === "All" || item.location === locationFilter;
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    
    return matchesSearch && matchesLocation && matchesCategory && matchesStatus;
  });
  
  // Handle export functionality
  const handleExport = () => {
    // In a real app, would generate CSV/Excel
    toast({
      title: "Export Started",
      description: "Your inventory data is being exported",
    });
  };
  
  // Handle import functionality
  const handleImport = () => {
    // In a real app, would open file selector and process import
    toast({
      title: "Import Feature",
      description: "File import feature is enabled",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Tracking</h1>
          <p className="text-muted-foreground">Manage your inventory across locations.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search inventory..." 
            className="pl-8 w-full" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          <Select
            value={locationFilter}
            onValueChange={setLocationFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map(loc => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="In Stock">In Stock</SelectItem>
              <SelectItem value="Low Stock">Low Stock</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Min Level</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  No inventory items found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.minLevel}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${
                      item.status === "In Stock" ? "bg-green-100 text-green-800" :
                      item.status === "Low Stock" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {item.status === "Low Stock" && <AlertTriangle className="h-3 w-3" />}
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <StockOperations 
                      itemId={item.id}
                      itemName={item.name}
                      currentQuantity={item.quantity}
                      onStockUpdate={handleStockUpdate}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

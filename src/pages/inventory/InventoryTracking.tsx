
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

export default function InventoryTracking() {
  // Placeholder data for inventory items
  const inventoryItems = [
    { id: 1, name: "Printer Ink Cartridge", sku: "INK-2023-001", category: "Office Supplies", quantity: 45, minLevel: 10, location: "Main Office", status: "In Stock" },
    { id: 2, name: "Toner Cartridge", sku: "TNR-2023-002", category: "Office Supplies", quantity: 8, minLevel: 10, location: "Main Office", status: "Low Stock" },
    { id: 3, name: "A4 Paper (Box)", sku: "PPR-2023-003", category: "Office Supplies", quantity: 25, minLevel: 5, location: "Storage Room", status: "In Stock" },
    { id: 4, name: "Network Cable CAT6", sku: "NET-2023-004", category: "IT Supplies", quantity: 120, minLevel: 20, location: "IT Storage", status: "In Stock" },
    { id: 5, name: "Laptop Cooling Pad", sku: "LCP-2023-005", category: "IT Equipment", quantity: 3, minLevel: 5, location: "Main Office", status: "Low Stock" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Tracking</h1>
          <p className="text-muted-foreground">Manage your inventory across locations.</p>
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
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search inventory..." className="pl-8 w-full" />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            Location: All
          </Button>
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
            {inventoryItems.map((item) => (
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
                  <Button variant="ghost" size="sm">Stock In</Button>
                  <Button variant="ghost" size="sm">Stock Out</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

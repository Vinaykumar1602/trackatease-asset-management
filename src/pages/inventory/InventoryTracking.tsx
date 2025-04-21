
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload, Plus } from "lucide-react";
import { useInventoryData } from "./hooks/useInventoryData";
import { useExportInventory } from "./utils/exportUtils";
import { InventoryFilters } from "./components/InventoryFilters";
import { InventoryTable } from "./components/InventoryTable";
import { AddInventoryItemDialog } from "./components/AddInventoryItemDialog";
import { ImportInventoryDialog } from "./components/ImportInventoryDialog";
import { InventoryEditDialog } from "./components/InventoryEditDialog";
import type { InventoryItem } from "./components/AddInventoryItemDialog";

export default function InventoryTracking() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);

  const {
    inventoryItems,
    handleStockUpdate,
    handleAddItem,
    handleImportItems,
    handleEditItem,
  } = useInventoryData();

  const { handleExport } = useExportInventory();
  
  // Filter out empty strings before creating Sets
  const rawLocations = inventoryItems.map(item => item.location).filter(Boolean);
  const rawCategories = inventoryItems.map(item => item.category).filter(Boolean);
  
  const locations = ["All", ...new Set(rawLocations)];
  const categories = ["All", ...new Set(rawCategories)];

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = locationFilter === "All" || item.location === locationFilter;
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    
    return matchesSearch && matchesLocation && matchesCategory && matchesStatus;
  });

  const lowStockCount = inventoryItems.filter(item => item.status === "Low Stock").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Tracking</h1>
          <p className="text-muted-foreground">
            Manage your inventory across locations.
            {lowStockCount > 0 && (
              <span className="ml-2 text-yellow-600">
                ({lowStockCount} items below minimum level)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport(filteredItems)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <ImportInventoryDialog onImportComplete={handleImportItems} />
          <Button size="sm" onClick={() => setAddItemDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <AddInventoryItemDialog 
        open={addItemDialogOpen}
        setOpen={setAddItemDialogOpen}
        onSave={handleAddItem}
        categories={categories.filter(c => c !== "All")}
        locations={locations.filter(l => l !== "All")}
      />

      <InventoryFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        locations={locations}
        categories={categories}
      />

      <InventoryTable
        items={filteredItems}
        onEdit={setEditingItem}
        onStockUpdate={handleStockUpdate}
      />

      <InventoryEditDialog
        item={editingItem}
        onSave={handleEditItem}
        onClose={() => setEditingItem(null)}
        categories={categories.filter(c => c !== "All")}
        locations={locations.filter(l => l !== "All")}
      />
    </div>
  );
}

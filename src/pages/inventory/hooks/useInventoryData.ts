
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { InventoryItem } from "../components/AddInventoryItemDialog";

export function useInventoryData() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { id: 1, name: "Printer Ink Cartridge", sku: "INK-2023-001", category: "Office Supplies", quantity: 45, minLevel: 10, location: "Main Office", status: "In Stock" },
    { id: 2, name: "Toner Cartridge", sku: "TNR-2023-002", category: "Office Supplies", quantity: 8, minLevel: 10, location: "Main Office", status: "Low Stock" },
    { id: 3, name: "A4 Paper (Box)", sku: "PPR-2023-003", category: "Office Supplies", quantity: 25, minLevel: 5, location: "Storage Room", status: "In Stock" },
    { id: 4, name: "Network Cable CAT6", sku: "NET-2023-004", category: "IT Supplies", quantity: 120, minLevel: 20, location: "IT Storage", status: "In Stock" },
    { id: 5, name: "Laptop Cooling Pad", sku: "LCP-2023-005", category: "IT Equipment", quantity: 3, minLevel: 5, location: "Main Office", status: "Low Stock" }
  ]);

  const { toast } = useToast();

  const handleStockUpdate = (id: number, quantity: number, operation: "in" | "out", notes: string) => {
    setInventoryItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = operation === "in" 
          ? item.quantity + quantity 
          : Math.max(0, item.quantity - quantity);
        
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
    
    toast({
      title: operation === "in" ? "Stock Added" : "Stock Removed",
      description: `${quantity} units of ${inventoryItems.find(item => item.id === id)?.name} have been ${operation === "in" ? "added to" : "removed from"} inventory.`
    });
  };

  const handleAddItem = (itemData: Omit<InventoryItem, "id" | "status">) => {
    const id = inventoryItems.length > 0 
      ? Math.max(...inventoryItems.map(item => item.id)) + 1 
      : 1;
    
    let status: "In Stock" | "Low Stock" | "Out of Stock" = "In Stock";
    if (itemData.quantity === 0) {
      status = "Out of Stock";
    } else if (itemData.quantity <= itemData.minLevel) {
      status = "Low Stock";
    }
    
    const newItem: InventoryItem = {
      ...itemData,
      id,
      status
    };
    
    setInventoryItems(prev => [...prev, newItem]);
    
    toast({
      title: "Item Added",
      description: `${newItem.name} has been added to inventory.`
    });
  };

  const handleImportItems = (items: Omit<InventoryItem, "id" | "status">[]) => {
    const newItems = items.map((item, index) => {
      const id = inventoryItems.length > 0 
        ? Math.max(...inventoryItems.map(item => item.id)) + index + 1 
        : index + 1;
      
      let status: "In Stock" | "Low Stock" | "Out of Stock" = "In Stock";
      if (item.quantity === 0) {
        status = "Out of Stock";
      } else if (item.quantity <= item.minLevel) {
        status = "Low Stock";
      }
      
      return {
        ...item,
        id,
        status
      };
    });
    
    setInventoryItems(prev => [...prev, ...newItems]);
    
    toast({
      title: "Import Successful",
      description: `${newItems.length} items have been imported to inventory.`
    });
  };

  const handleEditItem = (updatedItem: InventoryItem) => {
    setInventoryItems(prev => 
      prev.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
    
    toast({
      title: "Item Updated",
      description: `${updatedItem.name} has been updated successfully.`
    });
  };

  return {
    inventoryItems,
    handleStockUpdate,
    handleAddItem,
    handleImportItems,
    handleEditItem,
  };
}

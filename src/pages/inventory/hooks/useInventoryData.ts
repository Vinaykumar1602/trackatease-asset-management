
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { InventoryItem } from "../components/AddInventoryItemDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export function useInventoryData() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load inventory items from Supabase
  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('inventory')
          .select('*');
          
        if (error) throw error;
        
        // Map Supabase data to our InventoryItem format
        const mappedItems = data.map(item => ({
          id: item.id ? parseInt(item.id.toString().substring(0, 8), 16) : Math.floor(Math.random() * 1000000),
          name: item.name,
          sku: item.sku || '',
          category: item.category,
          quantity: item.quantity,
          minLevel: item.min_quantity,
          location: item.location || '',
          status: getItemStatus(item.quantity, item.min_quantity),
          supabaseId: item.id
        }));
        
        setInventoryItems(mappedItems);
      } catch (error) {
        console.error('Error fetching inventory:', error);
        toast({
          title: "Error",
          description: "Failed to load inventory items.",
          variant: "destructive",
        });
        // Fall back to local demo data if DB fetch fails
        setInventoryItems([
          { id: 1, name: "Printer Ink Cartridge", sku: "INK-2023-001", category: "Office Supplies", quantity: 45, minLevel: 10, location: "Main Office", status: "In Stock" },
          { id: 2, name: "Toner Cartridge", sku: "TNR-2023-002", category: "Office Supplies", quantity: 8, minLevel: 10, location: "Main Office", status: "Low Stock" },
          { id: 3, name: "A4 Paper (Box)", sku: "PPR-2023-003", category: "Office Supplies", quantity: 25, minLevel: 5, location: "Storage Room", status: "In Stock" },
          { id: 4, name: "Network Cable CAT6", sku: "NET-2023-004", category: "IT Supplies", quantity: 120, minLevel: 20, location: "IT Storage", status: "In Stock" },
          { id: 5, name: "Laptop Cooling Pad", sku: "LCP-2023-005", category: "IT Equipment", quantity: 3, minLevel: 5, location: "Main Office", status: "Low Stock" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryItems();
  }, [toast]);

  // Helper to determine status based on quantity and minimum level
  const getItemStatus = (quantity: number, minLevel: number): "In Stock" | "Low Stock" | "Out of Stock" => {
    if (quantity === 0) return "Out of Stock";
    if (quantity <= minLevel) return "Low Stock";
    return "In Stock";
  };

  const handleStockUpdate = async (id: number, quantity: number, operation: "in" | "out", notes: string) => {
    // Find the item to update
    const itemToUpdate = inventoryItems.find(item => item.id === id);
    if (!itemToUpdate) return;
    
    const newQuantity = operation === "in" 
      ? itemToUpdate.quantity + quantity 
      : Math.max(0, itemToUpdate.quantity - quantity);
    
    const newStatus = getItemStatus(newQuantity, itemToUpdate.minLevel);
    
    // Optimistically update the UI
    setInventoryItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity: newQuantity,
          status: newStatus
        };
      }
      return item;
    }));
    
    // Save to Supabase if we have a supabaseId
    if (itemToUpdate.supabaseId && user?.id) {
      try {
        const { error } = await supabase
          .from('inventory')
          .update({ 
            quantity: newQuantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', itemToUpdate.supabaseId);
          
        if (error) throw error;
        
      } catch (error) {
        console.error('Error updating inventory:', error);
        toast({
          title: "Error",
          description: "Failed to update inventory in database.",
          variant: "destructive",
        });
        
        // Revert the optimistic update on error
        setInventoryItems(prev => prev.map(item => {
          if (item.id === id) {
            return itemToUpdate;
          }
          return item;
        }));
        
        return;
      }
    }
    
    toast({
      title: operation === "in" ? "Stock Added" : "Stock Removed",
      description: `${quantity} units of ${itemToUpdate.name} have been ${operation === "in" ? "added to" : "removed from"} inventory.`
    });
  };

  const handleAddItem = async (itemData: Omit<InventoryItem, "id" | "status">) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add inventory items.",
        variant: "destructive",
      });
      return;
    }
    
    const status = getItemStatus(itemData.quantity, itemData.minLevel);
    
    try {
      // Add to Supabase first
      const { data, error } = await supabase
        .from('inventory')
        .insert({
          name: itemData.name,
          sku: itemData.sku,
          category: itemData.category,
          quantity: itemData.quantity,
          min_quantity: itemData.minLevel,
          location: itemData.location,
          created_by: user.id,
        })
        .select();
        
      if (error) throw error;
      
      const newId = data[0].id ? parseInt(data[0].id.toString().substring(0, 8), 16) : Math.floor(Math.random() * 1000000);
      
      const newItem: InventoryItem = {
        ...itemData,
        id: newId,
        status,
        supabaseId: data[0].id
      };
      
      // Update local state after successful DB insert
      setInventoryItems(prev => [...prev, newItem]);
      
      toast({
        title: "Item Added",
        description: `${newItem.name} has been added to inventory.`
      });
      
    } catch (error) {
      console.error('Error adding inventory item:', error);
      toast({
        title: "Error",
        description: "Failed to add inventory item to database.",
        variant: "destructive",
      });
    }
  };

  const handleImportItems = async (items: Omit<InventoryItem, "id" | "status">[]) => {
    if (!user?.id || items.length === 0) return;
    
    try {
      // Prepare items for database
      const dbItems = items.map(item => ({
        name: item.name,
        sku: item.sku,
        category: item.category,
        quantity: item.quantity,
        min_quantity: item.minLevel,
        location: item.location,
        created_by: user.id,
      }));
      
      // Insert to Supabase
      const { data, error } = await supabase
        .from('inventory')
        .insert(dbItems)
        .select();
        
      if (error) throw error;
      
      // Map returned data to inventory items
      const newItems: InventoryItem[] = data.map(item => ({
        id: parseInt(item.id.toString().substring(0, 8), 16),
        name: item.name,
        sku: item.sku || '',
        category: item.category,
        quantity: item.quantity,
        minLevel: item.min_quantity,
        location: item.location || '',
        status: getItemStatus(item.quantity, item.min_quantity),
        supabaseId: item.id
      }));
      
      // Update local state
      setInventoryItems(prev => [...prev, ...newItems]);
      
      toast({
        title: "Import Successful",
        description: `${newItems.length} items have been imported to inventory.`
      });
      
    } catch (error) {
      console.error('Error importing inventory items:', error);
      toast({
        title: "Import Failed",
        description: "There was an error importing the items.",
        variant: "destructive"
      });
    }
  };

  const handleEditItem = async (updatedItem: InventoryItem) => {
    if (!updatedItem.supabaseId) {
      // We need a supabaseId to update the DB
      setInventoryItems(prev => 
        prev.map(item => item.id === updatedItem.id ? updatedItem : item)
      );
    } else {
      try {
        const { error } = await supabase
          .from('inventory')
          .update({
            name: updatedItem.name,
            sku: updatedItem.sku,
            category: updatedItem.category,
            quantity: updatedItem.quantity,
            min_quantity: updatedItem.minLevel,
            location: updatedItem.location,
            updated_at: new Date().toISOString()
          })
          .eq('id', updatedItem.supabaseId);
          
        if (error) throw error;
        
        // Update local state after successful DB update
        setInventoryItems(prev => 
          prev.map(item => item.id === updatedItem.id ? updatedItem : item)
        );
        
        toast({
          title: "Item Updated",
          description: `${updatedItem.name} has been updated successfully.`
        });
        
      } catch (error) {
        console.error('Error updating inventory item:', error);
        toast({
          title: "Error",
          description: "Failed to update inventory item in database.",
          variant: "destructive",
        });
      }
    }
  };

  return {
    inventoryItems,
    loading,
    handleStockUpdate,
    handleAddItem,
    handleImportItems,
    handleEditItem,
  };
}

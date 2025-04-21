
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export function useInventoryData() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchInventoryItems();
  }, [user?.id]);

  const fetchInventoryItems = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('inventory')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        const formattedItems = data.map(item => ({
          id: item.id,
          name: item.name,
          sku: item.sku || '',
          category: item.category || '',
          quantity: item.quantity || 0,
          minQuantity: item.min_quantity || 0,
          status: determineStatus(item.quantity, item.min_quantity),
          location: item.location || '',
          supplier: item.supplier || '',
          unitPrice: item.unit_price || 0,
          lastRestock: item.last_restock ? new Date(item.last_restock).toISOString().split('T')[0] : '',
          updatedAt: item.updated_at ? new Date(item.updated_at).toISOString().split('T')[0] : ''
        }));

        setInventoryItems(formattedItems);
      }
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      toast({
        title: "Error",
        description: "Failed to load inventory items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const determineStatus = (quantity, minQuantity) => {
    if (quantity <= 0) return "Out of Stock";
    if (quantity <= minQuantity) return "Low Stock";
    return "In Stock";
  };

  const handleStockUpdate = async (id, newQuantity) => {
    try {
      const { error } = await supabase
        .from('inventory')
        .update({ 
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setInventoryItems(prev => prev.map(item => {
        if (item.id === id) {
          const updatedItem = {
            ...item,
            quantity: newQuantity,
            status: determineStatus(newQuantity, item.minQuantity),
            updatedAt: new Date().toISOString().split('T')[0]
          };
          return updatedItem;
        }
        return item;
      }));

      toast({
        title: "Success",
        description: "Stock quantity updated successfully",
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock quantity",
        variant: "destructive",
      });
    }
  };

  const handleAddItem = async (formData) => {
    try {
      if (!user?.id) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to add items",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('inventory')
        .insert({
          name: formData.name,
          sku: formData.sku,
          category: formData.category,
          quantity: formData.quantity,
          min_quantity: formData.minQuantity,
          location: formData.location,
          supplier: formData.supplier,
          unit_price: formData.unitPrice,
          created_by: user.id
        })
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        const newItem = {
          id: data[0].id,
          name: data[0].name,
          sku: data[0].sku || '',
          category: data[0].category || '',
          quantity: data[0].quantity || 0,
          minQuantity: data[0].min_quantity || 0,
          status: determineStatus(data[0].quantity, data[0].min_quantity),
          location: data[0].location || '',
          supplier: data[0].supplier || '',
          unitPrice: data[0].unit_price || 0,
          lastRestock: data[0].last_restock ? new Date(data[0].last_restock).toISOString().split('T')[0] : '',
          updatedAt: data[0].updated_at ? new Date(data[0].updated_at).toISOString().split('T')[0] : ''
        };

        setInventoryItems(prev => [...prev, newItem]);

        toast({
          title: "Success",
          description: `${formData.name} has been added to inventory.`,
        });
      }
    } catch (error) {
      console.error('Error adding inventory item:', error);
      toast({
        title: "Error",
        description: "Failed to add inventory item",
        variant: "destructive",
      });
    }
  };

  const handleImportItems = async (items) => {
    try {
      if (!user?.id || !items.length) return;

      const formattedItems = items.map(item => ({
        name: item.name,
        sku: item.sku || null,
        category: item.category || null,
        quantity: parseInt(item.quantity) || 0,
        min_quantity: parseInt(item.minQuantity) || 0,
        location: item.location || null,
        supplier: item.supplier || null,
        unit_price: parseFloat(item.unitPrice) || 0,
        created_by: user.id
      }));

      const { data, error } = await supabase
        .from('inventory')
        .insert(formattedItems)
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        const newItems = data.map(item => ({
          id: item.id,
          name: item.name,
          sku: item.sku || '',
          category: item.category || '',
          quantity: item.quantity || 0,
          minQuantity: item.min_quantity || 0,
          status: determineStatus(item.quantity, item.min_quantity),
          location: item.location || '',
          supplier: item.supplier || '',
          unitPrice: item.unit_price || 0,
          lastRestock: item.last_restock ? new Date(item.last_restock).toISOString().split('T')[0] : '',
          updatedAt: item.updated_at ? new Date(item.updated_at).toISOString().split('T')[0] : ''
        }));

        setInventoryItems(prev => [...prev, ...newItems]);

        toast({
          title: "Import Successful",
          description: `${newItems.length} items have been imported.`,
        });
      }
    } catch (error) {
      console.error('Error importing inventory items:', error);
      toast({
        title: "Import Failed",
        description: "There was an error importing the inventory items.",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = async (updatedItem) => {
    try {
      const { error } = await supabase
        .from('inventory')
        .update({
          name: updatedItem.name,
          sku: updatedItem.sku,
          category: updatedItem.category,
          quantity: updatedItem.quantity,
          min_quantity: updatedItem.minQuantity,
          location: updatedItem.location,
          supplier: updatedItem.supplier,
          unit_price: updatedItem.unitPrice,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedItem.id);

      if (error) {
        throw error;
      }

      setInventoryItems(prev => prev.map(item => 
        item.id === updatedItem.id ? {
          ...updatedItem,
          status: determineStatus(updatedItem.quantity, updatedItem.minQuantity),
          updatedAt: new Date().toISOString().split('T')[0]
        } : item
      ));

      toast({
        title: "Item Updated",
        description: "The inventory item has been updated.",
      });
    } catch (error) {
      console.error('Error updating inventory item:', error);
      toast({
        title: "Error",
        description: "Failed to update inventory item",
        variant: "destructive",
      });
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

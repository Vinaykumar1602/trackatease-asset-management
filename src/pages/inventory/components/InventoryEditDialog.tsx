
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InventoryItem } from "./AddInventoryItemDialog";

interface InventoryEditDialogProps {
  item: InventoryItem | null;
  onSave: (updatedItem: InventoryItem) => void;
  onClose: () => void;
  categories: string[];
  locations: string[];
}

export function InventoryEditDialog({ 
  item, 
  onSave, 
  onClose,
  categories,
  locations 
}: InventoryEditDialogProps) {
  const [editedItem, setEditedItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    if (item) {
      setEditedItem(item);
    }
  }, [item]);

  if (!item || !editedItem) return null;

  const handleSave = () => {
    if (editedItem) {
      onSave(editedItem);
    }
  };

  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Inventory Item</DialogTitle>
          <DialogDescription>
            Make changes to the inventory item here.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input
              id="name"
              value={editedItem.name}
              onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sku" className="text-right">SKU</Label>
            <Input
              id="sku"
              value={editedItem.sku}
              onChange={(e) => setEditedItem({ ...editedItem, sku: e.target.value })}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Select
              value={editedItem.category}
              onValueChange={(value) => setEditedItem({ ...editedItem, category: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={editedItem.quantity}
              onChange={(e) => setEditedItem({ ...editedItem, quantity: parseInt(e.target.value) || 0 })}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="minQuantity" className="text-right">Min Level</Label>
            <Input
              id="minQuantity"
              type="number"
              value={editedItem.minQuantity}
              onChange={(e) => setEditedItem({ ...editedItem, minQuantity: parseInt(e.target.value) || 0 })}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">Location</Label>
            <Select
              value={editedItem.location}
              onValueChange={(value) => setEditedItem({ ...editedItem, location: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier" className="text-right">Supplier</Label>
            <Input
              id="supplier"
              value={editedItem.supplier || ''}
              onChange={(e) => setEditedItem({ ...editedItem, supplier: e.target.value })}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unitPrice" className="text-right">Unit Price</Label>
            <Input
              id="unitPrice"
              type="number"
              step="0.01"
              value={editedItem.unitPrice || 0}
              onChange={(e) => setEditedItem({ ...editedItem, unitPrice: parseFloat(e.target.value) || 0 })}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

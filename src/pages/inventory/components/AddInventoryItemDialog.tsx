
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minQuantity: number;
  status: string; // "In Stock", "Low Stock", "Out of Stock"
  location: string;
  supplier: string;
  unitPrice: number;
  lastRestock: string;
  updatedAt: string;
}

type InventoryItemFormData = Omit<InventoryItem, "id" | "status">;

interface AddInventoryItemDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: (formData: InventoryItemFormData) => void;
  categories: string[];
  locations: string[];
}

export function AddInventoryItemDialog({ open, setOpen, onSave, categories, locations }: AddInventoryItemDialogProps) {
  const [formData, setFormData] = useState<InventoryItemFormData>({
    name: "",
    sku: "",
    category: categories[0] || "Office Supplies",
    quantity: 0,
    minQuantity: 5,
    location: locations[0] || "Main Office",
    supplier: "",
    unitPrice: 0,
    lastRestock: new Date().toISOString().split('T')[0],  // Add today's date
    updatedAt: new Date().toISOString().split('T')[0]     // Add today's date
  });

  const handleChange = (field: keyof InventoryItemFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      quantity: Number(formData.quantity),
      minQuantity: Number(formData.minQuantity),
      unitPrice: Number(formData.unitPrice),
      lastRestock: new Date().toISOString().split('T')[0],  // Ensure latest date
      updatedAt: new Date().toISOString().split('T')[0]     // Ensure latest date
    });
    
    setFormData({
      name: "",
      sku: "",
      category: categories[0] || "Office Supplies",
      quantity: 0,
      minQuantity: 5,
      location: locations[0] || "Main Office",
      supplier: "",
      unitPrice: 0,
      lastRestock: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    });
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
          <DialogDescription>
            Create a new inventory item. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sku" className="text-right">
              SKU
            </Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => handleChange("sku", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger id="category" className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min={0}
              value={formData.quantity}
              onChange={(e) => handleChange("quantity", Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="minQuantity" className="text-right">
              Min Quantity
            </Label>
            <Input
              id="minQuantity"
              type="number"
              min={0}
              value={formData.minQuantity}
              onChange={(e) => handleChange("minQuantity", Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Select
              value={formData.location}
              onValueChange={(value) => handleChange("location", value)}
            >
              <SelectTrigger id="location" className="col-span-3">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.length > 0 ? (
                  locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="Main Office">Main Office</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier" className="text-right">
              Supplier
            </Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) => handleChange("supplier", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unitPrice" className="text-right">
              Unit Price
            </Label>
            <Input
              id="unitPrice"
              type="number"
              min={0}
              step={0.01}
              value={formData.unitPrice}
              onChange={(e) => handleChange("unitPrice", Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={!formData.name}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

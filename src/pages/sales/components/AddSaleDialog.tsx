
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SaleFormData } from "../types";

interface AddSaleDialogProps {
  onSave: (data: SaleFormData) => void;
}

export function AddSaleDialog({ onSave }: AddSaleDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<SaleFormData>({
    productName: "",
    serialNo: "",
    client: "",
    contact: "",
    saleDate: "",
    warrantyExpiry: "",
    amcStartDate: "",
    amcExpiryDate: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    setIsOpen(false);
    setFormData({
      productName: "",
      serialNo: "",
      client: "",
      contact: "",
      saleDate: "",
      warrantyExpiry: "",
      amcStartDate: "",
      amcExpiryDate: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Sale
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Sale Record</DialogTitle>
          <DialogDescription>
            Enter the details for the new sale item. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNo">Serial Number</Label>
              <Input
                id="serialNo"
                name="serialNo"
                value={formData.serialNo}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client Name</Label>
              <Input
                id="client"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Person</Label>
              <Input
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="saleDate">Sale Date</Label>
              <Input
                id="saleDate"
                name="saleDate"
                type="date"
                value={formData.saleDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
              <Input
                id="warrantyExpiry"
                name="warrantyExpiry"
                type="date"
                value={formData.warrantyExpiry}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amcStartDate">AMC Start Date</Label>
              <Input
                id="amcStartDate"
                name="amcStartDate"
                type="date"
                value={formData.amcStartDate}
                onChange={handleInputChange}
                placeholder="Leave empty for N/A"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amcExpiryDate">AMC Expiry Date</Label>
              <Input
                id="amcExpiryDate"
                name="amcExpiryDate"
                type="date"
                value={formData.amcExpiryDate}
                onChange={handleInputChange}
                placeholder="Leave empty for N/A"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Save Sale Record</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

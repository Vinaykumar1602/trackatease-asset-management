
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
import { useState } from "react";
import { SalesItem, ServiceFormData } from "../types";

interface ServiceDialogProps {
  saleItem: SalesItem;
  onSave?: (data: ServiceFormData) => void;
}

export function ServiceDialogTrigger({ saleItem }: ServiceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    saleId: saleItem.id,
    date: new Date().toISOString().split('T')[0],
    technician: "",
    description: "",
    partsUsed: "",
    nextServiceDue: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Handle form submission
    setIsOpen(false);
    setFormData({
      saleId: saleItem.id,
      date: new Date().toISOString().split('T')[0],
      technician: "",
      description: "",
      partsUsed: "",
      nextServiceDue: ""
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Add Service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Service Record</DialogTitle>
          <DialogDescription>
            Record service details for {saleItem.productName} ({saleItem.serialNo})
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Service Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="technician">Technician</Label>
              <Input
                id="technician"
                name="technician"
                value={formData.technician}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Service Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partsUsed">Parts Used</Label>
              <Input
                id="partsUsed"
                name="partsUsed"
                value={formData.partsUsed}
                onChange={handleInputChange}
                placeholder="None"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextServiceDue">Next Service Due</Label>
              <Input
                id="nextServiceDue"
                name="nextServiceDue"
                type="date"
                value={formData.nextServiceDue}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Save Service Record</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

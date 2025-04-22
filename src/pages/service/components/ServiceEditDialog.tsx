
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
import { ServiceItem } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ServiceEditDialogProps {
  service: ServiceItem;
  onSave: (service: ServiceItem) => void;
  onCancel: () => void;
}

export function ServiceEditDialog({ 
  service, 
  onSave, 
  onCancel 
}: ServiceEditDialogProps) {
  const [formData, setFormData] = useState<ServiceItem>({ ...service });
  const [isOpen, setIsOpen] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    // Update SLA status automatically when status changes
    if (name === "status") {
      let slaStatus = formData.slaStatus;
      if (value === "Completed") {
        slaStatus = "Met";
      } else if (value === "Overdue") {
        slaStatus = "SLA Violated";
      }
      
      setFormData(prev => ({ 
        ...prev, 
        [name]: value, 
        slaStatus
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    onSave(formData);
    setIsOpen(false);
  };

  const handleCancel = () => {
    onCancel();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleCancel();
      setIsOpen(open);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogDescription>
            Make changes to the service details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-client" className="text-right">Client</Label>
            <Input
              id="edit-client"
              name="client"
              value={formData.client}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-product" className="text-right">Product</Label>
            <Input
              id="edit-product"
              name="product"
              value={formData.product}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-serialNo" className="text-right">Serial No.</Label>
            <Input
              id="edit-serialNo"
              name="serialNo"
              value={formData.serialNo}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-scheduledDate" className="text-right">Date</Label>
            <Input
              id="edit-scheduledDate"
              name="scheduledDate"
              type="date"
              value={formData.scheduledDate}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-technician" className="text-right">Technician</Label>
            <Input
              id="edit-technician"
              name="technician"
              value={formData.technician}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-status" className="text-right">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-slaStatus" className="text-right">SLA Status</Label>
            <Select
              value={formData.slaStatus}
              onValueChange={(value) => handleSelectChange("slaStatus", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select SLA status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Within SLA">Within SLA</SelectItem>
                <SelectItem value="Met">Met</SelectItem>
                <SelectItem value="SLA Violated">SLA Violated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

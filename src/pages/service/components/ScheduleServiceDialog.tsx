
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
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScheduleServiceDialogProps {
  onSchedule: (service: any) => Promise<boolean>;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleServiceDialog({ onSchedule, onOpenChange }: ScheduleServiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange(newOpen);
  };

  const [service, setService] = useState({
    product: "",
    serialNo: "",
    client: "",
    scheduledDate: new Date().toISOString().split('T')[0],
    technician: "",
    status: "Scheduled",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setService((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setService((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!service.product || !service.client || !service.scheduledDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      // Ensure technician is a string, not UUID
      const result = await onSchedule(service);
      if (result) {
        toast({
          title: "Service Scheduled",
          description: `Service for ${service.product} has been scheduled for ${service.scheduledDate}`,
        });
        handleOpenChange(false);
        setService({
          product: "",
          serialNo: "",
          client: "",
          scheduledDate: new Date().toISOString().split('T')[0],
          technician: "",
          status: "Scheduled",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to schedule service",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error scheduling service:", error);
      toast({
        title: "Error",
        description: "Failed to schedule service",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Schedule Service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Service</DialogTitle>
          <DialogDescription>
            Enter the details for the service appointment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product" className="text-right">
              Product
            </Label>
            <Input
              id="product"
              name="product"
              value={service.product}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="serialNo" className="text-right">
              Serial No
            </Label>
            <Input
              id="serialNo"
              name="serialNo"
              value={service.serialNo}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client" className="text-right">
              Client
            </Label>
            <Input
              id="client"
              name="client"
              value={service.client}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="scheduledDate" className="text-right">
              Date
            </Label>
            <Input
              id="scheduledDate"
              name="scheduledDate"
              type="date"
              value={service.scheduledDate}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="technician" className="text-right">
              Technician
            </Label>
            <Input
              id="technician"
              name="technician"
              value={service.technician}
              onChange={handleChange}
              className="col-span-3"
              placeholder="Enter technician name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select 
              value={service.status} 
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Scheduling..." : "Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

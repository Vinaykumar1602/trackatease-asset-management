
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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { SalesItem, ServiceFormData } from "../types";
import { useToast } from "@/components/ui/use-toast";
import { Wrench } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface ServiceDialogProps {
  saleItem: SalesItem;
  onSave?: (data: ServiceFormData) => void;
}

export function ServiceDialogTrigger({ saleItem, onSave }: ServiceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    saleId: saleItem.id,
    date: new Date().toISOString().split('T')[0],
    technician: "",
    description: "",
    partsUsed: "",
    nextServiceDue: "",
    remarks: ""
  });
  
  const { toast } = useToast();
  const { user } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add service records",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.date || !formData.technician || !formData.description) {
      toast({
        title: "Missing required fields",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // We need to check if the service_requests table exists in the database
      const { data: serviceData, error } = await supabase
        .from('service_requests')
        .insert({
          asset_id: formData.saleId, // Map to existing field
          title: formData.description,
          description: formData.remarks || null,
          scheduled_date: formData.date,
          priority: "medium",
          status: "completed",
          requested_by: user.id,
          assigned_to: formData.technician
        })
        .select();
        
      if (error) throw error;
      
      // Update the sale with the latest service information
      await supabase
        .from('sales')
        .update({
          status: "serviced", // Use an existing field to track last service
          updated_at: new Date().toISOString()
        })
        .eq('id', formData.saleId);
      
      if (onSave && serviceData) {
        onSave(formData);
      }
      
      toast({
        title: "Service Record Added",
        description: `Service record has been added for ${saleItem.productName}.`
      });
      
      // Reset form and close dialog
      setIsOpen(false);
      setFormData({
        saleId: saleItem.id,
        date: new Date().toISOString().split('T')[0],
        technician: "",
        description: "",
        partsUsed: "",
        nextServiceDue: "",
        remarks: ""
      });
    } catch (error) {
      console.error("Error adding service record:", error);
      toast({
        title: "Error",
        description: "Failed to add service record",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Wrench className="h-4 w-4 mr-2" />
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
              <Label htmlFor="date">Service Date*</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="technician">Technician*</Label>
              <Input
                id="technician"
                name="technician"
                value={formData.technician}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Service Description*</Label>
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
          
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              placeholder="Add any additional notes or remarks"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Save Service Record</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

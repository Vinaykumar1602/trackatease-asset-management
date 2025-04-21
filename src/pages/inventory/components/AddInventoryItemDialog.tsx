import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minLevel: number;
  location: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  supabaseId?: string;
}

const formSchema = z.object({
  sku: z.string().min(2, {
    message: "SKU must be at least 2 characters.",
  }),
  name: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  quantity: z.number().optional(),
  minLevel: z.number().optional(),
});

interface AddInventoryItemDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: (item: Omit<InventoryItem, "id" | "status">) => void;
  onAddItem?: (item: Omit<InventoryItem, "id" | "status">) => void;
  categories?: string[];
  locations?: string[];
}

export function AddInventoryItemDialog({ 
  open, 
  setOpen, 
  onSave, 
  onAddItem, 
  categories = ["Electronics", "Furniture", "Stationery", "Appliances"], 
  locations = ["Warehouse A", "Warehouse B", "Store Front", "Storage Unit"] 
}: AddInventoryItemDialogProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sku: "",
      name: "",
      category: "",
      location: "",
      quantity: 0,
      minLevel: 0,
    },
  });

  const handleSave = (data: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    
    const newItem: Omit<InventoryItem, "id" | "status"> = {
      sku: data.sku,
      name: data.name || "",
      category: data.category || "",
      location: data.location || "",
      quantity: data.quantity || 0,
      minLevel: data.minLevel || 0
    };
    
    if (onAddItem) {
      onAddItem(newItem);
    } else {
      onSave(newItem);
    }
    
    setIsSaving(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
          <DialogDescription>
            Add a new item to the inventory. Make sure to fill all the fields.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter SKU" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select a category for the item.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select a location for the item.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="Enter Quantity" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Level</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter Minimum Level" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Add Item"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

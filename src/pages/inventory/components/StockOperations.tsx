
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface StockOperationsProps {
  itemId: number;
  itemName: string;
  currentQuantity: number;
  onStockUpdate: (id: number, quantity: number, operation: "in" | "out", notes: string) => void;
}

type Operation = "in" | "out";

const formSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
  notes: z.string().min(3, "Notes must be at least 3 characters"),
});

export function StockOperations({ itemId, itemName, currentQuantity, onStockUpdate }: StockOperationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [operation, setOperation] = useState<Operation>("in");
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      notes: "",
    },
  });
  
  const openDialog = (op: Operation) => {
    setOperation(op);
    setIsOpen(true);
    form.reset({
      quantity: 1,
      notes: "",
    });
  };
  
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Check if there's enough stock for stock-out operations
    if (operation === "out" && values.quantity > currentQuantity) {
      toast({
        title: "Error",
        description: `Not enough items in stock. Current quantity is ${currentQuantity}`,
        variant: "destructive",
      });
      return;
    }
    
    onStockUpdate(itemId, values.quantity, operation, values.notes);
    
    toast({
      title: operation === "in" ? "Stock Added" : "Stock Removed",
      description: `${values.quantity} ${itemName} has been ${operation === "in" ? "added to" : "removed from"} inventory`,
    });
    
    setIsOpen(false);
  };
  
  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => openDialog("in")}>Stock In</Button>
      <Button variant="ghost" size="sm" onClick={() => openDialog("out")}>Stock Out</Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {operation === "in" ? "Stock In" : "Stock Out"}: {itemName}
            </DialogTitle>
            <DialogDescription>
              Current quantity: {currentQuantity}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter details about this transaction"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {operation === "in" ? "Add Stock" : "Remove Stock"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

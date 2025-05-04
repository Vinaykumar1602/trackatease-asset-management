
import { InventoryItem } from "../components/AddInventoryItemDialog";
import { useToast } from "@/components/ui/use-toast";

export function useExportInventory() {
  const { toast } = useToast();

  const handleExport = (items: InventoryItem[]) => {
    const headers = ["ID", "Name", "SKU", "Category", "Quantity", "Min Level", "Location", "Status", "Supplier", "Unit Price"];
    const csvContent = [
      headers.join(','),
      ...items.map(item => 
        [item.id, item.name, item.sku, item.category, item.quantity, item.minQuantity, item.location, item.status, item.supplier || '', item.unitPrice || ''].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "inventory.csv");
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Your inventory data has been exported to CSV."
    });
  };

  return { handleExport };
}

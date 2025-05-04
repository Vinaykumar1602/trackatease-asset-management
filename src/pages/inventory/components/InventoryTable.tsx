
import { Package, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StockOperations } from "./StockOperations";
import { InventoryItem } from "./AddInventoryItemDialog";

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onStockUpdate: (id: string, quantity: number, operation: "in" | "out", notes: string) => void;
}

export function InventoryTable({ items, onEdit, onStockUpdate }: InventoryTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Min Level</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                No inventory items found matching your criteria.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{item.name}</span>
                  </div>
                </TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.minQuantity}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${
                    item.status === "In Stock" ? "bg-green-100 text-green-800" :
                    item.status === "Low Stock" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {item.status === "Low Stock" && <AlertTriangle className="h-3 w-3" />}
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </Button>
                    <StockOperations 
                      itemId={item.id}
                      itemName={item.name}
                      currentQuantity={item.quantity}
                      onStockUpdate={onStockUpdate}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

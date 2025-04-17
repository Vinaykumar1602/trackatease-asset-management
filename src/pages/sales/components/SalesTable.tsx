
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { ShoppingCart, AlertTriangle, FileText, Edit, Trash2 } from "lucide-react";
import { SalesItem } from "../types";
import { ServiceDialogTrigger } from "./ServiceDialog";
import { DeleteSaleDialog } from "./DeleteSaleDialog";

interface SalesTableProps {
  items: SalesItem[];
  onEdit: (item: SalesItem) => void;
  onViewHistory: (id: number) => void;
}

export function SalesTable({ items, onEdit, onViewHistory }: SalesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product Name</TableHead>
          <TableHead>Serial No.</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Sale Date</TableHead>
          <TableHead>Warranty Expiry</TableHead>
          <TableHead>AMC Period</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Service</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center p-4 text-muted-foreground">
              No records found. Add a new sale record to get started.
            </TableCell>
          </TableRow>
        ) : (
          items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span>{item.productName}</span>
                </div>
              </TableCell>
              <TableCell>{item.serialNo}</TableCell>
              <TableCell>
                <div>
                  <p>{item.client}</p>
                  <p className="text-xs text-muted-foreground">{item.contact}</p>
                </div>
              </TableCell>
              <TableCell>{item.saleDate}</TableCell>
              <TableCell>{item.warrantyExpiry}</TableCell>
              <TableCell>
                {item.amcStartDate === "N/A" ? "No AMC" : `${item.amcStartDate} - ${item.amcExpiryDate}`}
              </TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${
                  item.status === "Active" ? "bg-green-100 text-green-800" :
                  item.status === "Expiring Soon" ? "bg-yellow-100 text-yellow-800" :
                  item.status === "Warranty Only" ? "bg-blue-100 text-blue-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {item.status === "Expiring Soon" && <AlertTriangle className="h-3 w-3" />}
                  {item.status}
                </span>
              </TableCell>
              <TableCell>
                {item.lastService ? (
                  <div>
                    <p className="text-sm">{item.lastService}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">{item.lastServiceNotes}</p>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">No records</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => onViewHistory(item.id)}>
                  <FileText className="h-4 w-4 mr-1" />
                  History
                </Button>
                <ServiceDialogTrigger saleItem={item} />
                <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <DeleteSaleDialog saleId={item.id} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

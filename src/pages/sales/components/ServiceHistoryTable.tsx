
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ServiceRecord, SalesItem } from "../types";

interface ServiceHistoryTableProps {
  records: ServiceRecord[];
  salesItems?: SalesItem[];
  compact?: boolean;
}

export function ServiceHistoryTable({ records, salesItems, compact = false }: ServiceHistoryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {!compact && <TableHead>Product</TableHead>}
          {!compact && <TableHead>Client</TableHead>}
          <TableHead>Service Date</TableHead>
          <TableHead>Technician</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Parts Used</TableHead>
          <TableHead>Next Due</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.length === 0 ? (
          <TableRow>
            <TableCell colSpan={compact ? 5 : 7} className="text-center p-4 text-muted-foreground">
              No service records found.
            </TableCell>
          </TableRow>
        ) : (
          records.map((record) => {
            const saleItem = salesItems?.find(item => item.id === record.saleId);
            return (
              <TableRow key={record.id}>
                {!compact && saleItem && (
                  <TableCell>
                    <div>
                      <p>{saleItem.productName}</p>
                      <p className="text-xs text-muted-foreground">{saleItem.serialNo}</p>
                    </div>
                  </TableCell>
                )}
                {!compact && saleItem && <TableCell>{saleItem.client}</TableCell>}
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.technician}</TableCell>
                <TableCell>{record.description}</TableCell>
                <TableCell>{record.partsUsed || "None"}</TableCell>
                <TableCell>{record.nextServiceDue}</TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}

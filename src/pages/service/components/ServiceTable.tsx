
import { ServiceItem } from "../types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Wrench, AlertCircle, CheckCircle } from "lucide-react";

interface ServiceTableProps {
  services: ServiceItem[];
  onEdit: (service: ServiceItem) => void;
  onComplete: (id: string) => void;
}

export function ServiceTable({ services, onEdit, onComplete }: ServiceTableProps) {
  if (services.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
          No service records found. Schedule a new service or adjust your filters.
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Serial No.</TableHead>
          <TableHead>Scheduled Date</TableHead>
          <TableHead>Technician</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>SLA Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.client}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <span>{item.product}</span>
              </div>
            </TableCell>
            <TableCell>{item.serialNo}</TableCell>
            <TableCell>{item.scheduledDate}</TableCell>
            <TableCell>{item.technician}</TableCell>
            <TableCell>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                item.status === "Scheduled" ? "bg-blue-100 text-blue-800" :
                item.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                item.status === "Completed" ? "bg-green-100 text-green-800" :
                "bg-red-100 text-red-800"
              }`}>
                {item.status}
              </span>
            </TableCell>
            <TableCell>
              <span className="flex items-center gap-1">
                {item.slaStatus === "Met" || item.slaStatus === "Within SLA" ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-red-500" />
                )}
                <span className="text-sm">{item.slaStatus}</span>
              </span>
            </TableCell>
            <TableCell className="text-right">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onEdit(item)}
              >
                Edit
              </Button>
              {item.status !== "Completed" && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onComplete(item.id)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Complete
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

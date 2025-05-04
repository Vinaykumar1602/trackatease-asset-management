
import { ServiceItem } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ServiceActions } from "./ServiceActions";
import { Badge } from "@/components/ui/badge";

interface ServiceTableProps {
  services: ServiceItem[];
  onEdit: (service: ServiceItem) => void;
  onComplete: (id: string) => void;
}

export const ServiceTable = ({ services, onEdit, onComplete }: ServiceTableProps) => {
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
          <TableHead>SLA</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center h-32 text-muted-foreground">
              No services found matching your criteria.
            </TableCell>
          </TableRow>
        ) : (
          services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>{service.client}</TableCell>
              <TableCell>{service.product}</TableCell>
              <TableCell>{service.serialNo || "N/A"}</TableCell>
              <TableCell>{service.scheduledDate || "Not scheduled"}</TableCell>
              <TableCell>{service.technician || "Unassigned"}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline"
                  className={
                    service.status === "Completed" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                    service.status === "Scheduled" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                    service.status === "Overdue" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                    service.status === "In Progress" ? "bg-amber-100 text-amber-800 hover:bg-amber-100" :
                    "bg-gray-100 text-gray-800 hover:bg-gray-100"
                  }
                >
                  {service.status}
                </Badge>
              </TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  service.slaStatus === "Met" ? "bg-green-100 text-green-800" : 
                  service.slaStatus === "SLA Violated" ? "bg-red-100 text-red-800" : 
                  "bg-blue-100 text-blue-800"
                }`}>
                  {service.slaStatus}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <ServiceActions 
                  service={service} 
                  onEdit={onEdit} 
                  onComplete={onComplete} 
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

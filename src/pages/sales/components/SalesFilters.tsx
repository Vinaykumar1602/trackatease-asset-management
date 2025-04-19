
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SalesItem } from "../types";

interface SalesFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  clientFilter: string;
  setClientFilter: (value: string) => void;
  warrantyFilter: string;
  setWarrantyFilter: (value: string) => void;
  salesItems: SalesItem[];
}

export function SalesFilters({
  statusFilter,
  setStatusFilter,
  clientFilter,
  setClientFilter,
  warrantyFilter,
  setWarrantyFilter,
  salesItems
}: SalesFiltersProps) {
  // Extract unique values from salesItems
  const statuses = ["All", ...new Set(salesItems.map(item => item.status))];
  const clients = ["All", ...new Set(salesItems.map(item => item.client))];
  const warrantyStatuses = ["All", "Valid", "Expiring Soon", "Expired"];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Client</Label>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client} value={client}>{client}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Warranty Status</Label>
            <Select value={warrantyFilter} onValueChange={setWarrantyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select warranty status" />
              </SelectTrigger>
              <SelectContent>
                {warrantyStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


import { Button } from "@/components/ui/button";
import { 
  Wrench,
  Calendar,
  Download,
  Plus, 
  Search,
  Filter,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ServiceManagement() {
  // Placeholder data for service management
  const serviceItems = [
    { 
      id: 1, 
      client: "ABC Corporation", 
      product: "Server System X1",
      serialNo: "SRV-X1-2023-001", 
      scheduledDate: "Jul 15, 2023",
      technician: "Mike Johnson",
      status: "Scheduled",
      slaStatus: "Within SLA"
    },
    { 
      id: 2, 
      client: "XYZ Inc", 
      product: "Network Switch N500",
      serialNo: "NSW-N500-2023-002", 
      scheduledDate: "Jul 17, 2023",
      technician: "Sarah Wilson",
      status: "Pending",
      slaStatus: "Within SLA"
    },
    { 
      id: 3, 
      client: "123 Solutions", 
      product: "Security Camera System",
      serialNo: "CAM-S1-2023-003", 
      scheduledDate: "Jul 10, 2023",
      technician: "David Brown",
      status: "Completed",
      slaStatus: "Met"
    },
    { 
      id: 4, 
      client: "City Mall", 
      product: "Digital Signage System",
      serialNo: "DSS-2022-004", 
      scheduledDate: "Jul 05, 2023",
      technician: "Unassigned",
      status: "Overdue",
      slaStatus: "SLA Violated"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Management</h1>
          <p className="text-muted-foreground">Schedule and track maintenance services.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Service
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search service records..." className="pl-8 w-full" />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            Status: All
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
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
            {serviceItems.map((item) => (
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
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">Complete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

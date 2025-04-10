
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Download, 
  Upload, 
  Plus, 
  Search,
  Filter,
  AlertTriangle
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

export default function SalesTracking() {
  // Placeholder data for sales and AMC
  const salesItems = [
    { 
      id: 1, 
      productName: "Server System X1", 
      serialNo: "SRV-X1-2023-001", 
      client: "ABC Corporation", 
      contact: "John Smith", 
      saleDate: "Jan 15, 2023", 
      warrantyExpiry: "Jan 15, 2024",
      amcStartDate: "Jan 16, 2024",
      amcExpiryDate: "Jan 15, 2025",
      status: "Active" 
    },
    { 
      id: 2, 
      productName: "Network Switch N500", 
      serialNo: "NSW-N500-2023-002", 
      client: "XYZ Inc", 
      contact: "Jane Doe", 
      saleDate: "Feb 10, 2023", 
      warrantyExpiry: "Feb 10, 2024",
      amcStartDate: "Feb 11, 2024",
      amcExpiryDate: "Feb 10, 2025",
      status: "Active" 
    },
    { 
      id: 3, 
      productName: "Security Camera System", 
      serialNo: "CAM-S1-2023-003", 
      client: "123 Solutions", 
      contact: "Bob Johnson", 
      saleDate: "Mar 05, 2023", 
      warrantyExpiry: "Mar 05, 2024",
      amcStartDate: "N/A",
      amcExpiryDate: "N/A",
      status: "Warranty Only" 
    },
    { 
      id: 4, 
      productName: "Digital Signage System", 
      serialNo: "DSS-2022-004", 
      client: "City Mall", 
      contact: "Mary Williams", 
      saleDate: "Dec 12, 2022", 
      warrantyExpiry: "Dec 12, 2023",
      amcStartDate: "Dec 13, 2023",
      amcExpiryDate: "Dec 12, 2024",
      status: "Expiring Soon" 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales & AMC Tracking</h1>
          <p className="text-muted-foreground">Track sold products, warranties and maintenance contracts.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Sale
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search by product or client..." className="pl-8 w-full" />
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
              <TableHead>Product Name</TableHead>
              <TableHead>Serial No.</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Sale Date</TableHead>
              <TableHead>Warranty Expiry</TableHead>
              <TableHead>AMC Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesItems.map((item) => (
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
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="ghost" size="sm">Services</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Package2, 
  Download, 
  Upload, 
  Plus, 
  Search,
  Filter,
  QrCode
} from "lucide-react";

export default function AssetManagement() {
  // Placeholder data for assets
  const assets = [
    { id: 1, name: "Desktop Computer", category: "IT Equipment", serial: "COMP-2023-001", location: "Main Office", assignedTo: "John Smith", status: "Active" },
    { id: 2, name: "Printer X500", category: "Office Equipment", serial: "PRINT-2023-002", location: "Finance Dept", assignedTo: "Finance Team", status: "Under Repair" },
    { id: 3, name: "Server Rack", category: "IT Infrastructure", serial: "SRV-2023-003", location: "Server Room", assignedTo: "IT Department", status: "Active" },
    { id: 4, name: "HVAC System", category: "Building Equipment", serial: "HVAC-2022-004", location: "Building A", assignedTo: "Facilities", status: "Active" },
    { id: 5, name: "Company Car", category: "Vehicles", serial: "CAR-2023-005", location: "Parking Lot", assignedTo: "Sales Team", status: "Active" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fixed Assets</h1>
          <p className="text-muted-foreground">Manage your company's fixed assets.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search assets..." className="pl-8 w-full" />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <QrCode className="h-4 w-4 mr-2" />
            Scan QR
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Serial No.</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Package2 className="h-4 w-4 text-muted-foreground" />
                    <span>{asset.name}</span>
                  </div>
                </TableCell>
                <TableCell>{asset.category}</TableCell>
                <TableCell>{asset.serial}</TableCell>
                <TableCell>{asset.location}</TableCell>
                <TableCell>{asset.assignedTo}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    asset.status === "Active" ? "bg-green-100 text-green-800" :
                    asset.status === "Under Repair" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {asset.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

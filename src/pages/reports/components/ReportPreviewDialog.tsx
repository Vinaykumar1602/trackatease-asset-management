import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ReportPreviewDialogProps {
  report: {
    title: string;
    description: string;
  };
  period: string;
  format: string;
  onClose: () => void;
}

export function ReportPreviewDialog({ report, period, format, onClose }: ReportPreviewDialogProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleDownload = () => {
    // Create a fake file download
    const blob = new Blob([`Dummy ${report.title} data for ${period}`], { type: 'text/plain' });
    const link = document.createElement("a");
    
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${report.title.replace(/\s+/g, '_').toLowerCase()}.${format}`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Report Downloaded",
      description: `${report.title} has been downloaded in ${format.toUpperCase()} format.`
    });
  };

  const generateReportPreview = () => {
    const getMockData = () => {
      switch (report.title) {
        case "Asset Register":
          return [
            { id: "001", name: "Desktop Computer", category: "IT Equipment", serial: "COMP-2023-001", location: "Main Office", status: "Active" },
            { id: "002", name: "Printer X500", category: "Office Equipment", serial: "PRINT-2023-002", location: "Finance Dept", status: "Under Repair" },
            { id: "003", name: "Server Rack", category: "IT Infrastructure", serial: "SRV-2023-003", location: "Server Room", status: "Active" },
          ];
        case "AMC Expiry Report":
          return [
            { client: "ABC Corp", product: "Server System X1", serial: "SRV-X1-2023-001", startDate: "2024-01-16", endDate: "2025-01-15", daysLeft: 45 },
            { client: "City Mall", product: "Digital Signage", serial: "DSS-2022-004", startDate: "2023-12-13", endDate: "2024-12-12", daysLeft: 15 },
          ];
        case "Service History":
          return [
            { date: "2024-03-10", product: "Server System X1", client: "ABC Corp", technician: "Mike Johnson", description: "Routine maintenance", nextService: "2024-09-10" },
            { date: "2024-04-05", product: "Network Switch", client: "XYZ Inc", technician: "Sarah Wilson", description: "Firmware update", nextService: "2024-07-05" },
          ];
        default:
          return [];
      }
    };

    const data = getMockData();

    switch (report.title) {
      case "Asset Register":
        return (
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Asset ID</th>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Category</th>
                  <th className="py-2 px-4 text-left">Serial No.</th>
                  <th className="py-2 px-4 text-left">Location</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item: any) => (
                  <tr key={item.id}>
                    <td className="py-2 px-4 border-t">{item.id}</td>
                    <td className="py-2 px-4 border-t">{item.name}</td>
                    <td className="py-2 px-4 border-t">{item.category}</td>
                    <td className="py-2 px-4 border-t">{item.serial}</td>
                    <td className="py-2 px-4 border-t">{item.location}</td>
                    <td className="py-2 px-4 border-t">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      
      case "AMC Expiry Report":
        return (
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Client</th>
                  <th className="py-2 px-4 text-left">Product</th>
                  <th className="py-2 px-4 text-left">Serial No.</th>
                  <th className="py-2 px-4 text-left">AMC Start</th>
                  <th className="py-2 px-4 text-left">AMC Expiry</th>
                  <th className="py-2 px-4 text-left">Days Left</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-t">{item.client}</td>
                    <td className="py-2 px-4 border-t">{item.product}</td>
                    <td className="py-2 px-4 border-t">{item.serial}</td>
                    <td className="py-2 px-4 border-t">{item.startDate}</td>
                    <td className="py-2 px-4 border-t">{item.endDate}</td>
                    <td className="py-2 px-4 border-t">{item.daysLeft}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      case "Service History":
        return (
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Product</th>
                  <th className="py-2 px-4 text-left">Client</th>
                  <th className="py-2 px-4 text-left">Technician</th>
                  <th className="py-2 px-4 text-left">Description</th>
                  <th className="py-2 px-4 text-left">Next Service</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-t">{item.date}</td>
                    <td className="py-2 px-4 border-t">{item.product}</td>
                    <td className="py-2 px-4 border-t">{item.client}</td>
                    <td className="py-2 px-4 border-t">{item.technician}</td>
                    <td className="py-2 px-4 border-t">{item.description}</td>
                    <td className="py-2 px-4 border-t">{item.nextService}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      default:
        return (
          <div className="bg-gray-100 p-8 text-center rounded-lg">
            <p className="text-muted-foreground">Preview not available for this report type.</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{report.title} - Preview</DialogTitle>
          <DialogDescription>
            Report period: {period === "last7" ? "Last 7 days" : 
                            period === "last30" ? "Last 30 days" : 
                            period === "last90" ? "Last 90 days" : "Custom range"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {generateReportPreview()}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download {format.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

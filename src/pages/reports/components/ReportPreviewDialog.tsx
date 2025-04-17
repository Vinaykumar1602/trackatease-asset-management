
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

  // Generate fake report data based on report type
  const generateReportPreview = () => {
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
                <tr>
                  <td className="py-2 px-4 border-t">001</td>
                  <td className="py-2 px-4 border-t">Desktop Computer</td>
                  <td className="py-2 px-4 border-t">IT Equipment</td>
                  <td className="py-2 px-4 border-t">COMP-2023-001</td>
                  <td className="py-2 px-4 border-t">Main Office</td>
                  <td className="py-2 px-4 border-t">Active</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-t">002</td>
                  <td className="py-2 px-4 border-t">Printer X500</td>
                  <td className="py-2 px-4 border-t">Office Equipment</td>
                  <td className="py-2 px-4 border-t">PRINT-2023-002</td>
                  <td className="py-2 px-4 border-t">Finance Dept</td>
                  <td className="py-2 px-4 border-t">Under Repair</td>
                </tr>
                {/* Add more sample rows as needed */}
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
                <tr>
                  <td className="py-2 px-4 border-t">ABC Corporation</td>
                  <td className="py-2 px-4 border-t">Server System X1</td>
                  <td className="py-2 px-4 border-t">SRV-X1-2023-001</td>
                  <td className="py-2 px-4 border-t">Jan 16, 2024</td>
                  <td className="py-2 px-4 border-t">Jan 15, 2025</td>
                  <td className="py-2 px-4 border-t">45</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-t">City Mall</td>
                  <td className="py-2 px-4 border-t">Digital Signage System</td>
                  <td className="py-2 px-4 border-t">DSS-2022-004</td>
                  <td className="py-2 px-4 border-t">Dec 13, 2023</td>
                  <td className="py-2 px-4 border-t">Dec 12, 2024</td>
                  <td className="py-2 px-4 border-t">15</td>
                </tr>
                {/* Add more sample rows as needed */}
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
                <tr>
                  <td className="py-2 px-4 border-t">Mar 10, 2024</td>
                  <td className="py-2 px-4 border-t">Server System X1</td>
                  <td className="py-2 px-4 border-t">ABC Corporation</td>
                  <td className="py-2 px-4 border-t">Mike Johnson</td>
                  <td className="py-2 px-4 border-t">Routine maintenance</td>
                  <td className="py-2 px-4 border-t">Sep 10, 2024</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-t">Apr 5, 2024</td>
                  <td className="py-2 px-4 border-t">Network Switch N500</td>
                  <td className="py-2 px-4 border-t">XYZ Inc</td>
                  <td className="py-2 px-4 border-t">Sarah Wilson</td>
                  <td className="py-2 px-4 border-t">Firmware update</td>
                  <td className="py-2 px-4 border-t">Jul 5, 2024</td>
                </tr>
                {/* Add more sample rows as needed */}
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

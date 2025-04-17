
import { useState, useRef } from "react";
import { 
  FileBarChart, 
  FileText,
  Download,
  Calendar,
  Printer,
  Play,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ReportPreviewDialog } from "./components/ReportPreviewDialog";

interface ReportType {
  title: string;
  description: string;
  icon: any;
  formats: string[];
}

export default function Reports() {
  const [reportPeriods, setReportPeriods] = useState<Record<string, string>>({
    "Asset Register": "last30",
    "Asset Valuation Report": "last30",
    "Inventory Movement": "last30",
    "Inventory Valuation": "last30",
    "AMC Expiry Report": "last30",
    "Service History": "last30"
  });

  const [reportFormats, setReportFormats] = useState<Record<string, string>>({
    "Asset Register": "excel",
    "Asset Valuation Report": "excel",
    "Inventory Movement": "excel",
    "Inventory Valuation": "excel",
    "AMC Expiry Report": "excel",
    "Service History": "excel"
  });

  const [previewingReport, setPreviewingReport] = useState<ReportType | null>(null);
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  
  const { toast } = useToast();

  const reportTypes: ReportType[] = [
    {
      title: "Asset Register",
      description: "Complete list of all registered assets with their details",
      icon: FileText,
      formats: ["Excel", "PDF"]
    },
    {
      title: "Asset Valuation Report",
      description: "Current value of assets after depreciation",
      icon: FileBarChart,
      formats: ["Excel", "PDF"]
    },
    {
      title: "Inventory Movement",
      description: "Track inventory movement across locations",
      icon: FileText,
      formats: ["Excel"]
    },
    {
      title: "Inventory Valuation",
      description: "Current value of inventory items",
      icon: FileBarChart,
      formats: ["Excel", "PDF"]
    },
    {
      title: "AMC Expiry Report",
      description: "List of AMCs expiring in the next 30/60/90 days",
      icon: Calendar,
      formats: ["Excel", "PDF"]
    },
    {
      title: "Service History",
      description: "Complete service history for each product",
      icon: FileText,
      formats: ["Excel", "PDF"]
    }
  ];

  const handlePeriodChange = (reportTitle: string, period: string) => {
    setReportPeriods(prev => ({
      ...prev,
      [reportTitle]: period
    }));
  };

  const handleFormatChange = (reportTitle: string, format: string) => {
    setReportFormats(prev => ({
      ...prev,
      [reportTitle]: format
    }));
  };

  const handlePreview = (report: ReportType) => {
    setPreviewingReport(report);
  };

  const handleGenerate = (report: ReportType) => {
    setGenerating(prev => ({
      ...prev,
      [report.title]: true
    }));

    // Simulate report generation
    setTimeout(() => {
      const format = reportFormats[report.title];
      const period = reportPeriods[report.title];
      
      toast({
        title: "Report Generated",
        description: `${report.title} has been generated in ${format.toUpperCase()} format.`
      });
      
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
      
      setGenerating(prev => ({
        ...prev,
        [report.title]: false
      }));
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Audit</h1>
        <p className="text-muted-foreground">Generate and download reports for your business data.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report, index) => (
          <Card key={index} className="shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <report.icon className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>{report.title}</CardTitle>
                <CardDescription className="mt-1">{report.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <div className="space-y-1">
                  <div className="font-medium text-sm">Date Range</div>
                  <div className="flex gap-2">
                    <Select 
                      value={reportPeriods[report.title]} 
                      onValueChange={(value) => handlePeriodChange(report.title, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last7">Last 7 days</SelectItem>
                        <SelectItem value="last30">Last 30 days</SelectItem>
                        <SelectItem value="last90">Last 90 days</SelectItem>
                        <SelectItem value="custom">Custom range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-sm">Format</div>
                  <div className="flex gap-2">
                    <Select 
                      value={reportFormats[report.title]} 
                      onValueChange={(value) => handleFormatChange(report.title, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        {report.formats.map((format) => (
                          <SelectItem key={format} value={format.toLowerCase()}>
                            {format}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex space-x-2 w-full">
                <Button variant="outline" className="flex-1" onClick={() => handlePreview(report)}>
                  <Printer className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={() => handleGenerate(report)}
                  disabled={generating[report.title]}
                >
                  {generating[report.title] ? (
                    <>
                      <Play className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {previewingReport && (
        <ReportPreviewDialog 
          report={previewingReport} 
          period={reportPeriods[previewingReport.title]}
          format={reportFormats[previewingReport.title]}
          onClose={() => setPreviewingReport(null)}
        />
      )}
    </div>
  );
}

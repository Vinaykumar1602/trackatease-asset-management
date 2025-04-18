
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileUp, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ImportFormat } from "../types";
import { Progress } from "@/components/ui/progress";

interface ImportDialogProps {
  type: "sales" | "service";
  onImportComplete: (data: any[]) => void;
}

export function ImportDialog({ type, onImportComplete }: ImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mappingFields, setMappingFields] = useState<{[key: string]: string}>({});
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const requiredFields = type === "sales" 
    ? ["productName", "serialNo", "client", "saleDate"] 
    : ["saleId", "date", "technician", "description"];

  const fieldOptions = type === "sales" 
    ? ["productName", "serialNo", "client", "clientBranch", "clientBranchCode", "contact", "saleDate", 
       "warrantyExpiry", "amcStartDate", "amcExpiryDate", "location", "status"] 
    : ["saleId", "date", "technician", "description", "partsUsed", "nextServiceDue", "remarks"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      if (selectedFile.type === "text/csv" || 
          selectedFile.type === "application/vnd.ms-excel" ||
          selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        parseFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV or Excel file.",
          variant: "destructive"
        });
        setFile(null);
      }
    }
  };

  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        // This is a simplified version. In a real application, you'd use a library like papaparse for CSV
        // or xlsx for Excel files to properly parse the data
        const csvData = event.target?.result as string;
        const lines = csvData.split("\n");
        const headers = lines[0].split(",");
        
        // Initialize mapping with best guesses based on header names
        const initialMapping: {[key: string]: string} = {};
        headers.forEach(header => {
          const normalizedHeader = header.trim().toLowerCase();
          const matchedField = fieldOptions.find(field => 
            normalizedHeader.includes(field.toLowerCase())
          );
          if (matchedField) {
            initialMapping[header.trim()] = matchedField;
          }
        });
        
        setMappingFields(initialMapping);
        
        // Create preview data
        const previewRows = [];
        for (let i = 1; i < Math.min(lines.length, 6); i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(",");
          const row: {[key: string]: string} = {};
          
          headers.forEach((header, index) => {
            row[header.trim()] = values[index]?.trim() || "";
          });
          
          previewRows.push(row);
        }
        
        setPreviewData(previewRows);
        setStep(2);
      } catch (error) {
        console.error("Error parsing file:", error);
        toast({
          title: "Error parsing file",
          description: "The file could not be parsed. Please check the format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const handleMappingChange = (fileHeader: string, appField: string) => {
    setMappingFields(prev => ({
      ...prev,
      [fileHeader]: appField
    }));
  };

  const handleImport = () => {
    // Check if all required fields are mapped
    const mappedRequiredFields = requiredFields.filter(field => 
      Object.values(mappingFields).includes(field)
    );
    
    if (mappedRequiredFields.length !== requiredFields.length) {
      toast({
        title: "Missing required fields",
        description: `Please map all required fields: ${requiredFields.join(", ")}`,
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress > 100) progress = 100;
      setUploadProgress(progress);
      
      if (progress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          // Process the data using the mapping
          const processedData = previewData.map(row => {
            const processedRow: ImportFormat = {};
            
            Object.keys(mappingFields).forEach(fileHeader => {
              const appField = mappingFields[fileHeader];
              processedRow[appField] = row[fileHeader];
            });
            
            return processedRow;
          });
          
          onImportComplete(processedData);
          
          toast({
            title: "Import successful",
            description: `Successfully imported ${processedData.length} ${type} records.`
          });
          
          setIsUploading(false);
          setFile(null);
          setPreviewData([]);
          setMappingFields({});
          setStep(1);
          setIsOpen(false);
        }, 500);
      }
    }, 300);
  };

  const resetImport = () => {
    setFile(null);
    setPreviewData([]);
    setMappingFields({});
    setStep(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Import {type === "sales" ? "Sales & AMC" : "Service"} Records</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file with your data. You'll be able to map the columns to the right fields.
          </DialogDescription>
        </DialogHeader>
        
        {step === 1 && (
          <div className="space-y-6 py-4">
            <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-10 text-center">
              <FileUp className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Drag and drop your file here</h3>
              <p className="text-sm text-muted-foreground mb-4">Or click to browse</p>
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
              <Label htmlFor="file-upload">
                <Button variant="outline" className="w-full sm:w-auto">
                  Select File
                </Button>
              </Label>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Supported formats:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>CSV (.csv)</li>
                <li>Excel (.xlsx, .xls)</li>
              </ul>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Map Your Data</h3>
              <Button variant="ghost" size="sm" onClick={resetImport}>
                Select Different File
              </Button>
            </div>
            
            <div className="border rounded-md p-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Match the columns from your file to the fields in our system.
                <span className="text-destructive">*</span> indicates required fields.
              </p>
              
              <div className="space-y-3">
                {Object.keys(previewData[0] || {}).map(fileHeader => (
                  <div key={fileHeader} className="grid grid-cols-2 gap-4 items-center">
                    <div>
                      <p className="text-sm font-medium">{fileHeader}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        Sample: {previewData[0][fileHeader]}
                      </p>
                    </div>
                    <div>
                      <Select 
                        value={mappingFields[fileHeader] || ""} 
                        onValueChange={(value) => handleMappingChange(fileHeader, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Do not import</SelectItem>
                          {fieldOptions.map(field => (
                            <SelectItem key={field} value={field}>
                              {field} {requiredFields.includes(field) && <span className="text-destructive">*</span>}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Required fields mapped:</p>
                {mappedRequiredFields.length === requiredFields.length ? (
                  <div className="flex items-center text-green-500">
                    <Check className="h-4 w-4 mr-1" />
                    <span className="text-sm">All required fields mapped</span>
                  </div>
                ) : (
                  <div className="flex items-center text-destructive">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      Missing {requiredFields.length - mappedRequiredFields.length} required fields
                    </span>
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Required fields: {requiredFields.join(", ")}
              </div>
            </div>
          </div>
        )}
        
        {isUploading && (
          <div className="py-2">
            <p className="text-sm mb-2">Uploading and processing your data...</p>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
        
        <DialogFooter>
          {step === 1 ? (
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={handleImport} disabled={isUploading}>
                {isUploading ? "Processing..." : "Import Data"}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

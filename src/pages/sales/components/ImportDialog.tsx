
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
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ImportFormat } from "../types";
import { FileUploadSection } from "./import/FileUploadSection";
import { FieldMappingSection } from "./import/FieldMappingSection";
import { UploadProgress } from "./import/UploadProgress";

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

  const calculateMappedRequiredFields = () => {
    return requiredFields.filter(field => 
      Object.values(mappingFields).includes(field)
    );
  };

  const mappedRequiredFields = calculateMappedRequiredFields();

  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const lines = csvData.split("\n");
        const headers = lines[0].split(",");
        
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

  const handleMappingChange = (fileHeader: string, appField: string) => {
    setMappingFields(prev => ({
      ...prev,
      [fileHeader]: appField
    }));
  };

  const handleImport = () => {
    const currentMappedRequiredFields = calculateMappedRequiredFields();
    
    if (currentMappedRequiredFields.length !== requiredFields.length) {
      toast({
        title: "Missing required fields",
        description: `Please map all required fields: ${requiredFields.join(", ")}`,
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress > 100) progress = 100;
      setUploadProgress(progress);
      
      if (progress === 100) {
        clearInterval(interval);
        setTimeout(() => {
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
          
          resetImport();
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
    setIsUploading(false);
    setUploadProgress(0);
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
          <FileUploadSection onFileChange={handleFileChange} />
        )}
        
        {step === 2 && (
          <FieldMappingSection 
            previewData={previewData}
            mappingFields={mappingFields}
            fieldOptions={fieldOptions}
            requiredFields={requiredFields}
            onMappingChange={handleMappingChange}
            onReset={resetImport}
            mappedRequiredFields={mappedRequiredFields}
          />
        )}
        
        <UploadProgress 
          isUploading={isUploading}
          progress={uploadProgress}
        />
        
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

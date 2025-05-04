
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ServiceItem } from "../types";

interface ImportExportServicesProps {
  services: ServiceItem[];
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
}

export const ImportExportServices = ({ services, onImport, onExport }: ImportExportServicesProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      
      <Button variant="outline" size="sm" onClick={handleImportClick}>
        <Upload className="h-4 w-4 mr-2" />
        Import
      </Button>
      
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        className="hidden"
        onChange={onImport}
      />
    </div>
  );
};

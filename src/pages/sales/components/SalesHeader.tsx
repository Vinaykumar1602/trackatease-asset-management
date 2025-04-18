
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { AddSaleDialog } from "./AddSaleDialog";
import { ImportDialog } from "./ImportDialog";
import { ImportFormat } from "../types";

interface SalesHeaderProps {
  onImportComplete: (data: ImportFormat[], type: 'sales' | 'service') => void;
  onExportCSV: (type: 'sales' | 'service') => void;
}

export function SalesHeader({ onImportComplete, onExportCSV }: SalesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales & AMC Tracking</h1>
        <p className="text-muted-foreground">Track sold products, warranties and maintenance contracts.</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onExportCSV('sales')}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <ImportDialog 
          type="sales" 
          onImportComplete={(data) => onImportComplete(data, 'sales')} 
        />
        <AddSaleDialog onSave={() => {}} />
      </div>
    </div>
  );
}

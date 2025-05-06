
import { Button } from "@/components/ui/button";
import { Calendar, List, Plus } from "lucide-react";
import { ScheduleServiceDialog } from "./ScheduleServiceDialog";
import { useState, useRef } from "react";
import { ServiceItem } from "../types";

export interface ServiceHeaderProps {
  viewMode: "table" | "calendar";
  setViewMode: (mode: "table" | "calendar") => void;
  onScheduleService: (newService: Omit<ServiceItem, "id" | "slaStatus">) => Promise<boolean>;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ServiceHeader({ 
  viewMode, 
  setViewMode, 
  onScheduleService,
  onExport,
  onImport
}: ServiceHeaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onImport}
        accept=".csv,.xlsx,.xls"
        style={{ display: 'none' }}
      />

      <Button variant="outline" size="sm" onClick={onExport}>
        Export
      </Button>
      
      <Button variant="outline" size="sm" onClick={handleImportClick}>
        Import
      </Button>
      
      <Button size="sm" onClick={() => setDialogOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Schedule Service
      </Button>
      
      <div className="flex border rounded-md overflow-hidden">
        <Button
          variant={viewMode === "table" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("table")}
          className="rounded-none"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "calendar" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("calendar")}
          className="rounded-none"
        >
          <Calendar className="h-4 w-4" />
        </Button>
      </div>
      
      <ScheduleServiceDialog 
        onOpenChange={setDialogOpen}
        onSchedule={onScheduleService}
      />
    </div>
  );
}

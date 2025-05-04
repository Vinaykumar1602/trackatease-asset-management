
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ScheduleServiceDialog } from "./ScheduleServiceDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceItem } from "../types";

interface ServiceHeaderProps {
  viewMode: "table" | "calendar";
  setViewMode: (mode: "table" | "calendar") => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onScheduleService: (newService: Omit<ServiceItem, 'id' | 'slaStatus'>) => void;
}

export const ServiceHeader = ({
  viewMode,
  setViewMode,
  onExport,
  onImport,
  onScheduleService
}: ServiceHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Service Management</h1>
        <p className="text-muted-foreground">Schedule and track maintenance services.</p>
      </div>
      <div className="flex items-center gap-2">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "table" | "calendar")}>
          <TabsList>
            <TabsTrigger value="table">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 mr-2"
              >
                <path d="M12 3v18" />
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18" />
                <path d="M3 15h18" />
              </svg>
              Table View
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 mr-2"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              Calendar
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-4 w-4 mr-2" />
          Import
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            className="hidden"
            onChange={onImport}
          />
        </Button>
        <ScheduleServiceDialog onSave={onScheduleService} />
      </div>
    </div>
  );
};

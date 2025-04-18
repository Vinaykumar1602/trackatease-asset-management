
import { FileUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FileUploadSectionProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUploadSection({ onFileChange }: FileUploadSectionProps) {
  return (
    <div className="space-y-6 py-4">
      <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-10 text-center">
        <FileUp className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Drag and drop your file here</h3>
        <p className="text-sm text-muted-foreground mb-4">Or click to browse</p>
        <Input
          id="file-upload"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={onFileChange}
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
  );
}

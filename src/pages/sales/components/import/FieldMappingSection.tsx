
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, AlertCircle } from "lucide-react";

interface FieldMappingSectionProps {
  previewData: any;
  mappingFields: { [key: string]: string };
  fieldOptions: string[];
  requiredFields: string[];
  onMappingChange: (fileHeader: string, appField: string) => void;
  onReset: () => void;
  mappedRequiredFields: string[];
}

export function FieldMappingSection({
  previewData,
  mappingFields,
  fieldOptions,
  requiredFields,
  onMappingChange,
  onReset,
  mappedRequiredFields,
}: FieldMappingSectionProps) {
  if (!previewData.length) return null;

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Map Your Data</h3>
        <Button variant="ghost" size="sm" onClick={onReset}>
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
                  onValueChange={(value) => onMappingChange(fileHeader, value)}
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
  );
}

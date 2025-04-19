
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
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { InventoryItem } from "../InventoryTracking";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

interface ImportInventoryDialogProps {
  onImportComplete: (items: Omit<InventoryItem, "id" | "status">[]) => void;
}

export function ImportInventoryDialog({ onImportComplete }: ImportInventoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    totalItems?: number;
    validItems?: number;
  } | null>(null);
  
  const { toast } = useToast();
  
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        toast({
          title: "Invalid File",
          description: "Please select a CSV file.",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      setImportResult(null);
    }
  };
  
  const handleImport = () => {
    if (!file) return;
    
    setImporting(true);
    setProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 200);
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        // Parse the CSV
        const text = event.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim());
        
        // Use the first row as headers
        const headers = rows[0].split(',');
        
        // Map the data to our inventory item format
        const importedItems = rows.slice(1).map(row => {
          const values = row.split(',');
          
          return {
            name: values[0] || "",
            sku: values[1] || "",
            category: values[2] || "Office Supplies",
            quantity: parseInt(values[3]) || 0,
            minLevel: parseInt(values[4]) || 5,
            location: values[5] || "Main Office",
          };
        });
        
        // Filter out items with missing required fields
        const validItems = importedItems.filter(item => 
          item.name && (item.sku || item.name.length > 0)
        );
        
        // Complete the import
        clearInterval(progressInterval);
        setProgress(100);
        
        setTimeout(() => {
          setImporting(false);
          
          if (validItems.length > 0) {
            setImportResult({
              success: true,
              message: `Successfully imported ${validItems.length} items.`,
              totalItems: importedItems.length,
              validItems: validItems.length,
            });
            
            onImportComplete(validItems);
          } else {
            setImportResult({
              success: false,
              message: "No valid items found in the imported file.",
              totalItems: importedItems.length,
              validItems: 0,
            });
          }
        }, 500);
        
      } catch (error) {
        clearInterval(progressInterval);
        setProgress(0);
        setImporting(false);
        
        setImportResult({
          success: false,
          message: "Failed to parse the CSV file. Please check the format.",
        });
      }
    };
    
    reader.readAsText(file);
  };
  
  const handleClose = () => {
    if (!importing) {
      setIsOpen(false);
      setFile(null);
      setImportResult(null);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Inventory Items</DialogTitle>
          <DialogDescription>
            Upload a CSV file with inventory data to import multiple items at once.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!importing && !importResult && (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
              <FileText className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-muted-foreground mb-4">
                Select a CSV file to import inventory items
              </p>
              <input
                type="file"
                accept=".csv"
                id="inventory-import"
                className="hidden"
                onChange={handleFileSelected}
              />
              <label htmlFor="inventory-import">
                <Button variant="outline" type="button" className="cursor-pointer">
                  Choose File
                </Button>
              </label>
              {file && (
                <p className="text-sm mt-2">
                  Selected file: <span className="font-medium">{file.name}</span>
                </p>
              )}
            </div>
          )}
          
          {importing && (
            <div className="space-y-4">
              <p className="text-sm text-center">Importing your data...</p>
              <Progress value={progress} className="w-full" />
            </div>
          )}
          
          {importResult && (
            <div className={`p-4 rounded-lg ${importResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-start">
                {importResult.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                )}
                <div>
                  <p className={`font-medium ${importResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    {importResult.success ? 'Import Successful' : 'Import Failed'}
                  </p>
                  <p className="text-sm mt-1">
                    {importResult.message}
                  </p>
                  {importResult.success && importResult.totalItems && (
                    <ul className="text-sm mt-2 space-y-1">
                      <li>Total items found: {importResult.totalItems}</li>
                      <li>Valid items imported: {importResult.validItems}</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">CSV Format Requirements:</p>
            <p>The CSV file should have the following columns:</p>
            <ol className="list-decimal pl-5 space-y-1 mt-2">
              <li>Item Name (required)</li>
              <li>SKU</li>
              <li>Category</li>
              <li>Quantity</li>
              <li>Minimum Level</li>
              <li>Location</li>
            </ol>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={importing}>
            {importResult?.success ? 'Close' : 'Cancel'}
          </Button>
          {file && !importing && !importResult && (
            <Button type="button" onClick={handleImport}>
              Import Data
            </Button>
          )}
          {importResult && !importResult.success && (
            <Button type="button" onClick={() => setImportResult(null)}>
              Try Again
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

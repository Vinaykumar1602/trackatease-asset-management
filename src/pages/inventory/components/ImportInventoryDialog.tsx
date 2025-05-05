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
import { InventoryItem } from "./AddInventoryItemDialog";
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
        if (newProgress >= 90) {
          clearInterval(progressInterval);
          return 90;
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
        const headers = rows[0].split(',').map(header => header.trim().toLowerCase());
        
        // Map the data to our inventory item format
        const importedItems = rows.slice(1).map(row => {
          const values = row.split(',').map(value => value.trim());
          const item: Record<string, any> = {};
          
          headers.forEach((header, index) => {
            if (index < values.length) {
              // Convert header names to match our expected property names
              if (header === "minlevel" || header === "minquantity" || header === "minimum") {
                item["minQuantity"] = values[index];
              } else if (header === "price" || header === "unitprice") {
                item["unitPrice"] = values[index];
              } else if (header === "itemname") {
                item["name"] = values[index];
              } else if (header === "itemcode" || header === "code") {
                item["sku"] = values[index];
              } else if (header === "vendor") {
                item["supplier"] = values[index];
              } else {
                item[header] = values[index];
              }
            }
          });
          
          return {
            name: item.name || "",
            sku: item.sku || "",
            category: item.category || "Office Supplies",
            quantity: parseInt(item.quantity || "0"),
            minQuantity: parseInt(item.minQuantity || "5"),
            location: item.location || "Main Office",
            supplier: item.supplier || "",
            unitPrice: parseFloat(item.unitPrice || "0"),
            lastRestock: new Date().toISOString().split('T')[0],  // Use today's date
            updatedAt: new Date().toISOString().split('T')[0]     // Use today's date
          };
        });
        
        // Filter out items with missing required fields
        const validItems = importedItems.filter(item => 
          item.name && item.name.length > 0
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
        <Button onClick={() => setIsOpen(true)} variant="outline" size="sm">
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
            <div className={`p-4 rounded-lg ${importResult.success ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
              <div className="flex items-start">
                {importResult.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                )}
                <div>
                  <p className={`font-medium ${importResult.success ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
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
              <li>Supplier</li>
              <li>Unit Price</li>
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

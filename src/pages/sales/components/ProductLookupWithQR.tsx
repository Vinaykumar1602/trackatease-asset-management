
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QrScanDialog } from "./QrScanDialog";
import { toast } from "@/components/ui/use-toast";
import { QrCode, Search } from "lucide-react";

// Define Product interface locally instead of importing from @/types
export interface Product {
  id: string;
  name: string;
  sku: string;
  // Add other properties as needed
}

interface ProductLookupProps {
  open: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
  products: Product[];
  salesItems?: any[];
}

export function ProductLookupWithQR({ open, onClose, onSelect, products, salesItems }: ProductLookupProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Perform search on every keystroke
    if (query.trim()) {
      performSearch(query);
    } else {
      setSearchResults([]);
    }
  };
  
  const performSearch = (query: string) => {
    setIsSearching(true);
    
    // Simulate a short delay as if searching through a database
    setTimeout(() => {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.sku.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(results);
      setIsSearching(false);
      
      console.log(`Searching for "${query}". Found ${results.length} results.`);
    }, 300);
  };

  const handleQrCodeScanned = (decodedText: string) => {
    console.log("QR Code scanned: ", decodedText);
    
    // Check if the decoded text is a valid product ID or SKU
    const foundProduct = products.find(
      (product) => product.id === decodedText || product.sku === decodedText
    );
    
    if (foundProduct) {
      toast({
        title: "Product Found",
        description: `Found product: ${foundProduct.name}`,
      });
      onSelect(foundProduct);
      setQrDialogOpen(false);
    } else {
      toast({
        title: "Product Not Found",
        description: "No product matches the scanned QR code.",
        variant: "destructive"
      });
      
      // Set the search query to the scanned text to help user find similar products
      setSearchQuery(decodedText);
      performSearch(decodedText);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Product</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search product by name or serial..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-8"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setQrDialogOpen(true)}
              title="Scan QR Code"
            >
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
          
          <QrScanDialog
            open={qrDialogOpen}
            onClose={() => setQrDialogOpen(false)}
            onScan={handleQrCodeScanned}
          />
          
          {isSearching ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : searchQuery && searchResults.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No products found matching "{searchQuery}"
            </div>
          ) : (
            <ul className="max-h-60 overflow-y-auto border rounded-md divide-y">
              {searchResults.map((product) => (
                <li
                  key={product.id}
                  className="py-2 px-3 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  onClick={() => onSelect(product)}
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs text-muted-foreground">Serial: {product.sku}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="button" disabled={searchResults.length === 0} onClick={() => {
            if (searchResults.length > 0) {
              onSelect(searchResults[0]);
            }
          }}>
            Select
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

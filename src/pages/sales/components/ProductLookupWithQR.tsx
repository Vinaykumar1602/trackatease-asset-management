import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { QrScanDialog } from "./QrScanDialog";
import { toast } from "@/components/ui/use-toast";

interface ProductLookupProps {
  open: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
  products: Product[];
}

export function ProductLookupWithQR({ open, onClose, onSelect, products }: ProductLookupProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQrCodeScanned = (decodedText: string) => {
    // Check if the decoded text is a valid product ID or SKU
    const foundProduct = products.find(
      (product) => product.id === decodedText || product.sku === decodedText
    );
    
    if (foundProduct) {
      onSelect(foundProduct);
      setQrDialogOpen(false);
    } else {
      toast({
        title: "Product Not Found",
        description: "No product matches the scanned QR code.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Product</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Search product..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <Button variant="outline" size="sm" onClick={() => setQrDialogOpen(true)}>
            Scan QR Code
          </Button>
          <QrScanDialog
            open={qrDialogOpen}
            onClose={() => setQrDialogOpen(false)}
            onScan={handleQrCodeScanned}
          />
          {filteredProducts.length > 0 ? (
            <ul className="max-h-40 overflow-y-auto">
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  className="py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  onClick={() => onSelect(product)}
                >
                  {product.name} ({product.sku})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No products found.</p>
          )}
        </div>
        <Button type="submit" onClick={onClose}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}

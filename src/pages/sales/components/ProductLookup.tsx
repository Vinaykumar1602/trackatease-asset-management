
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SalesItem } from "../types";
import { Asset } from "../../assets/types";
import { Html5QrcodeScanner } from 'html5-qrcode';

interface ProductLookupProps {
  salesItems: SalesItem[];
  assets?: Asset[];
  onSelect: (item: SalesItem | Asset) => void;
}

export function ProductLookup({ salesItems, assets = [], onSelect }: ProductLookupProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Array<SalesItem | Asset>>([]);
  const [showQrScanner, setShowQrScanner] = useState(false);
  
  useEffect(() => {
    if (searchTerm.length > 0) {
      const term = searchTerm.toLowerCase();
      
      // Search in sales items
      const salesResults = salesItems.filter(
        item => 
          item.productName.toLowerCase().includes(term) ||
          item.serialNo.toLowerCase().includes(term) ||
          item.client.toLowerCase().includes(term) ||
          (item.clientBranch && item.clientBranch.toLowerCase().includes(term))
      );
      
      // Search in assets
      const assetResults = assets.filter(
        item => 
          item.name.toLowerCase().includes(term) ||
          item.serial.toLowerCase().includes(term) ||
          (item.location && item.location.toLowerCase().includes(term))
      );
      
      setResults([...salesResults, ...assetResults]);
    } else {
      setResults([]);
    }
  }, [searchTerm, salesItems, assets]);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (showQrScanner) {
      scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scanner.render((decodedText) => {
        setSearchTerm(decodedText);
        setShowQrScanner(false);
        scanner?.clear();
      }, (error) => {
        console.warn(`QR Code scanning failed: ${error}`);
      });
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [showQrScanner]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already being performed on searchTerm change
  };
  
  const handleSelect = (item: SalesItem | Asset) => {
    onSelect(item);
    setIsOpen(false);
    setSearchTerm("");
  };
  
  const isAsset = (item: SalesItem | Asset): item is Asset => {
    return (item as Asset).category !== undefined;
  };

  return (
    <>
      <Popover open={isOpen && !showQrScanner} onOpenChange={setIsOpen}>
        <form onSubmit={handleSearch} className="flex gap-2">
          <PopoverTrigger asChild>
            <Input
              placeholder="Search by product name, serial number, client..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onClick={() => setIsOpen(true)}
              className="w-full md:w-[350px]"
            />
          </PopoverTrigger>
          <Button type="submit" size="icon" variant="secondary">
            <Search className="h-4 w-4" />
          </Button>
          <Button 
            type="button" 
            size="icon" 
            variant="outline"
            onClick={() => setShowQrScanner(true)}
          >
            <QrCode className="h-4 w-4" />
          </Button>
        </form>
        
        <PopoverContent className="w-[350px] p-0" align="start">
          <div className="max-h-[300px] overflow-y-auto">
            {results.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                {searchTerm.length > 0 
                  ? "No products found matching your search." 
                  : "Type to search for products."}
              </div>
            ) : (
              <div>
                {results.map((item, index) => {
                  const isSalesItem = !isAsset(item);
                  return (
                    <div 
                      key={`${isSalesItem ? 'sale' : 'asset'}-${item.id}`} 
                      className="p-3 hover:bg-muted border-b last:border-b-0 cursor-pointer"
                      onClick={() => handleSelect(item)}
                    >
                      <div className="flex justify-between">
                        <div className="font-medium">
                          {isSalesItem ? item.productName : item.name}
                        </div>
                        <div className="text-xs bg-muted-foreground/20 px-2 py-0.5 rounded">
                          {isSalesItem ? "SALES" : "ASSET"}
                        </div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <div className="text-sm text-muted-foreground">
                          S/N: {isSalesItem ? item.serialNo : item.serial}
                        </div>
                        {!isSalesItem && (
                          <div className="text-xs text-muted-foreground">
                            Location: {item.location}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={showQrScanner} onOpenChange={setShowQrScanner}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
          </DialogHeader>
          <div id="qr-reader" className="w-full" />
        </DialogContent>
      </Dialog>
    </>
  );
}

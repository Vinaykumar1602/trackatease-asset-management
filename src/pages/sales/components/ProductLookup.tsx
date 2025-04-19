
import { useState, useEffect, useRef } from "react";
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
import { useToast } from "@/components/ui/use-toast";

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
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  
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
    // Clean up scanner when component unmounts
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, []);

  // Initialize QR scanner when dialog is shown
  useEffect(() => {
    if (showQrScanner && scannerContainerRef.current) {
      // Small timeout to ensure the DOM element is available
      const initScanner = setTimeout(() => {
        try {
          scannerRef.current = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
          );
          
          scannerRef.current.render((decodedText) => {
            // Successfully scanned QR code
            setSearchTerm(decodedText);
            setShowQrScanner(false);
            
            toast({
              title: "QR Code Scanned",
              description: `Searching for: ${decodedText}`,
            });
          }, (error) => {
            // Error occurs during scanning
            console.warn(`QR Code scanning failed: ${error}`);
          });
        } catch (error) {
          console.error("Error initializing QR scanner:", error);
          toast({
            title: "QR Scanner Error",
            description: "Could not initialize QR scanner",
            variant: "destructive"
          });
          setShowQrScanner(false);
        }
      }, 500); // Slightly longer delay to ensure DOM is ready
      
      return () => {
        clearTimeout(initScanner);
        if (scannerRef.current) {
          scannerRef.current.clear().catch(console.error);
          scannerRef.current = null;
        }
      };
    }
  }, [showQrScanner, toast]);
  
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

      <Dialog open={showQrScanner} onOpenChange={(open) => {
        setShowQrScanner(open);
        if (!open && scannerRef.current) {
          scannerRef.current.clear().catch(console.error);
          scannerRef.current = null;
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
          </DialogHeader>
          <div id="qr-reader" className="w-full h-64 mx-auto" ref={scannerContainerRef} />
        </DialogContent>
      </Dialog>
    </>
  );
}

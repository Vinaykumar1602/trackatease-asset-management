
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { QrCode, Search } from "lucide-react";
import { QrScanDialog } from "./QrScanDialog";
import { SalesItem } from "../types";

interface ProductLookupProps {
  salesItems: SalesItem[];
  onSelect: (item: SalesItem) => void;
}

export function ProductLookupWithQR({ salesItems, onSelect }: ProductLookupProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  
  const handleQrScan = (code: string) => {
    // Set the search query to the scanned code
    setSearchQuery(code);
    
    // Check if the code matches any of the items
    const matchedItem = salesItems.find(
      item => 
        item.serialNo.toLowerCase() === code.toLowerCase() || 
        item.productId.toString() === code || 
        item.productName.toLowerCase().includes(code.toLowerCase())
    );
    
    // If a match is found, select the item
    if (matchedItem) {
      onSelect(matchedItem);
    }
    
    // Open the popover to show search results
    setIsPopoverOpen(true);
  };

  // Filter the items based on the search query
  const filteredItems = searchQuery
    ? salesItems.filter((item) =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.serialNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.client.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      <div className="flex items-center space-x-2 w-full md:w-64">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              role="combobox" 
              className="w-full justify-between"
            >
              <Search className="mr-2 h-4 w-4" />
              Search Products
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Search by product name, serial no..." 
                value={searchQuery} 
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty>No products found.</CommandEmpty>
                <CommandGroup>
                  {filteredItems.map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => {
                        onSelect(item);
                        setIsPopoverOpen(false);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{item.productName}</span>
                        <span className="text-xs text-muted-foreground">
                          SN: {item.serialNo} | Client: {item.client}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsQrScannerOpen(true)}
          title="Scan QR Code"
        >
          <QrCode className="h-4 w-4" />
        </Button>
      </div>
      
      <QrScanDialog 
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onScan={handleQrScan}
      />
    </>
  );
}

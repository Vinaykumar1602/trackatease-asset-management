
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { QrCode, X } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useToast } from "@/components/ui/use-toast";

interface QrScanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (code: string) => void;
}

export function QrScanDialog({ isOpen, onClose, onScan }: QrScanDialogProps) {
  const qrReaderRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize QR scanner when dialog opens
  useEffect(() => {
    if (isOpen && qrReaderRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        try {
          const scannerId = "qr-reader-" + Math.random().toString(36).substring(7);
          
          // Create container element for scanner
          if (qrReaderRef.current) {
            qrReaderRef.current.innerHTML = "";
            const scannerElement = document.createElement("div");
            scannerElement.id = scannerId;
            qrReaderRef.current.appendChild(scannerElement);
            
            // Initialize scanner
            scannerRef.current = new Html5QrcodeScanner(
              scannerId,
              {
                fps: 10,
                qrbox: 250,
                aspectRatio: 1.0,
                formatsToSupport: [
                  Html5QrcodeScanner.FORMATS.QR_CODE,
                  Html5QrcodeScanner.FORMATS.CODE_128,
                  Html5QrcodeScanner.FORMATS.CODE_39
                ],
                showTorchButtonIfSupported: true,
              },
              /* verbose= */ false
            );
            
            scannerRef.current.render(
              (decodedText) => {
                // Success callback
                console.log("QR code scanned:", decodedText);
                onScan(decodedText);
                toast({
                  title: "QR Code Scanned",
                  description: "Search results updated with scanned data.",
                });
                onClose();
              },
              (errorMessage) => {
                // Error callback is called continuously during scanning, no need to show to user
                console.error("QR scan error:", errorMessage);
              }
            );
            
            setScanning(true);
            setError(null);
          }
        } catch (err) {
          console.error("Error initializing QR scanner:", err);
          setError("Failed to initialize camera. Please ensure camera permissions are granted and try again.");
        }
      }, 300);
    }
    
    // Cleanup function
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (err) {
          console.error("Error cleaning up QR scanner:", err);
        }
        scannerRef.current = null;
      }
    };
  }, [isOpen, onScan, onClose, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <QrCode className="h-5 w-5 mr-2" />
            Scan QR Code
          </DialogTitle>
          <DialogDescription>
            Position QR code in the camera view to scan product information.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          {error ? (
            <div className="text-center p-4 border rounded-md bg-red-50 text-red-700">
              <p>{error}</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          ) : (
            <div 
              ref={qrReaderRef} 
              className="qr-reader-container w-full max-w-[400px] mx-auto"
            />
          )}
          
          {scanning && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={onClose}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel Scan
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

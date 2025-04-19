
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Html5QrcodeScanner } from "html5-qrcode";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface QrScanDialogProps {
  open: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
}

export function QrScanDialog({ open, onClose, onScan }: QrScanDialogProps) {
  const qrBoxRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (open && qrBoxRef.current) {
      try {
        // Only initialize scanner when dialog is open and element exists
        const qrBoxId = "qr-reader";
        
        // Make sure the element exists
        if (!document.getElementById(qrBoxId) && qrBoxRef.current) {
          const qrDiv = document.createElement('div');
          qrDiv.id = qrBoxId;
          qrBoxRef.current.appendChild(qrDiv);
        }
        
        // Create scanner with proper configuration
        scannerRef.current = new Html5QrcodeScanner(
          qrBoxId,
          {
            fps: 10,
            qrbox: 250,
            // Use correct format specifiers
            formatsToSupport: [
              0, // QR_CODE
              1, // AZTEC
              2, // CODABAR
            ]
          },
          false
        );

        scannerRef.current.render(
          (decodedText) => {
            onScan(decodedText);
            onClose();
          },
          (errorMessage) => {
            console.error("QR Scanner error:", errorMessage);
          }
        );
      } catch (error) {
        console.error("Error initializing QR scanner:", error);
        setHasError(true);
        setErrorMessage("Failed to initialize camera. Please make sure camera access is allowed.");
      }
    }

    // Cleanup function
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (error) {
          console.error("Error clearing scanner:", error);
        }
      }
    };
  }, [open, onScan, onClose]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
        </DialogHeader>
        
        {hasError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : (
          <div ref={qrBoxRef} className="flex flex-col items-center justify-center">
            {/* QR Scanner will be rendered here */}
            <div className="text-center text-sm text-muted-foreground mt-4">
              Position the QR code within the box to scan
            </div>
          </div>
        )}
        
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

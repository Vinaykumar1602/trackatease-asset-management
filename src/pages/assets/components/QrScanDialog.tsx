
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { QrCode, Camera, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface QrScanDialogProps {
  onScan: (serial: string) => void;
}

export function QrScanDialog({ onScan }: QrScanDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [manualSerial, setManualSerial] = useState("");
  const [cameraActive, setCameraActive] = useState(false);

  const handleScan = () => {
    if (manualSerial) {
      onScan(manualSerial);
      setIsOpen(false);
      setManualSerial("");
    }
  };

  const simulateScan = () => {
    // Simulate a QR code scan since we can't access the camera in this environment
    setCameraActive(true);
    
    // Simulate scanning delay
    setTimeout(() => {
      const demoSerial = "SRV-X1-2023-001"; // Using a serial from our sample data
      setCameraActive(false);
      onScan(demoSerial);
      setIsOpen(false);
    }, 2000);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <QrCode className="h-4 w-4 mr-2" />
        Scan QR
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogDescription>
              Scan a QR code to find the associated asset or manually enter a serial number.
            </DialogDescription>
          </DialogHeader>
          
          {cameraActive ? (
            <div className="flex flex-col items-center space-y-4 py-8">
              <div className="w-64 h-64 bg-gray-100 relative flex items-center justify-center">
                <Camera className="h-12 w-12 text-muted-foreground animate-pulse" />
                <div className="absolute border-2 border-blue-500 inset-4"></div>
              </div>
              <p className="text-sm text-muted-foreground">Scanning for QR codes...</p>
              <Button variant="outline" onClick={() => setCameraActive(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel Scan
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="flex flex-col space-y-2">
                <Button onClick={simulateScan}>
                  <Camera className="h-4 w-4 mr-2" />
                  Activate Camera
                </Button>
              </div>
              
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-muted-foreground">Or enter serial number manually:</p>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter serial number"
                    value={manualSerial}
                    onChange={(e) => setManualSerial(e.target.value)}
                  />
                  <Button onClick={handleScan} disabled={!manualSerial}>
                    Search
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {!cameraActive && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

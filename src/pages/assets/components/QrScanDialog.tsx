
import { useState, useRef, useEffect } from "react";
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
import { useToast } from "@/components/ui/use-toast";

interface QrScanDialogProps {
  onScan: (serial: string) => void;
}

export function QrScanDialog({ onScan }: QrScanDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [manualSerial, setManualSerial] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  // Clean up camera stream when dialog closes or component unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!cameraActive) return;
    
    let animationFrameId: number;
    let scanInterval: NodeJS.Timeout;
    
    const startCamera = async () => {
      try {
        const constraints = {
          video: { facingMode: "environment" }
        };
        
        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCameraPermission(true);
          setCameraError(null);
          
          // Set up scanning interval
          scanInterval = setInterval(() => {
            if (canvasRef.current && videoRef.current) {
              const canvas = canvasRef.current;
              const context = canvas.getContext('2d');
              if (context) {
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                
                // Here you would typically use a QR code library to scan the canvas
                // For demo purposes, we'll simulate finding a QR code after a few seconds
                // In a real implementation, you would use a library like jsQR
              }
            }
          }, 500);
          
          // Simulate QR code detection after a few seconds for demo
          setTimeout(() => {
            if (isOpen && cameraActive) {
              const demoSerial = "SRV-X1-2023-001"; // Using a serial from sample data
              handleScanSuccess(demoSerial);
            }
          }, 3000);
        }
      } catch (err: any) {
        console.error("Error accessing camera:", err);
        setHasCameraPermission(false);
        setCameraError(err.message || "Could not access camera");
        
        toast({
          title: "Camera Access Error",
          description: "Please allow camera access to scan QR codes or enter the serial number manually.",
          variant: "destructive"
        });
      }
    };

    startCamera();
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      cancelAnimationFrame(animationFrameId);
      clearInterval(scanInterval);
    };
  }, [cameraActive, isOpen]);

  const handleScan = () => {
    if (manualSerial) {
      onScan(manualSerial);
      setIsOpen(false);
      setManualSerial("");
    }
  };

  const handleScanSuccess = (result: string) => {
    setCameraActive(false);
    toast({
      title: "QR Code Detected",
      description: `Found serial: ${result}`
    });
    onScan(result);
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <QrCode className="h-4 w-4 mr-2" />
        Scan QR
      </Button>
      
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setCameraActive(false);
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogDescription>
              Scan a QR code to find the associated asset or manually enter a serial number.
            </DialogDescription>
          </DialogHeader>
          
          {cameraActive ? (
            <div className="flex flex-col items-center space-y-4 py-8">
              {hasCameraPermission === false ? (
                <div className="text-center space-y-4">
                  <p className="text-red-500">Camera access was denied</p>
                  <p className="text-sm text-muted-foreground">
                    Please grant camera permission in your browser settings to scan QR codes
                  </p>
                </div>
              ) : cameraError ? (
                <div className="text-center space-y-4">
                  <p className="text-red-500">Camera error: {cameraError}</p>
                </div>
              ) : (
                <div className="relative w-64 h-64">
                  <video 
                    ref={videoRef} 
                    className="w-full h-full bg-gray-100 object-cover"
                    autoPlay 
                    playsInline
                    muted
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute border-2 border-blue-500 inset-4"></div>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                {hasCameraPermission === false ? "Camera access denied" : "Scanning for QR codes..."}
              </p>
              <Button variant="outline" onClick={() => setCameraActive(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel Scan
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="flex flex-col space-y-2">
                <Button onClick={() => setCameraActive(true)}>
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

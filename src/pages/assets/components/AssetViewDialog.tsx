
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Asset } from "../types";
import { FileBarChart, Calendar, Wrench } from "lucide-react";

interface AssetViewDialogProps {
  asset: Asset | null;
  onClose: () => void;
}

export function AssetViewDialog({ asset, onClose }: AssetViewDialogProps) {
  if (!asset) return null;

  return (
    <Dialog open={!!asset} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Asset Details</DialogTitle>
          <DialogDescription>
            Detailed information about {asset.name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Basic Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Name:</span>
                <span>{asset.name}</span>
                <span className="text-muted-foreground">Category:</span>
                <span>{asset.category}</span>
                <span className="text-muted-foreground">Serial Number:</span>
                <span>{asset.serial}</span>
                <span className="text-muted-foreground">Location:</span>
                <span>{asset.location}</span>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Assignment & Status</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Assigned To:</span>
                <span>{asset.assignedTo}</span>
                <span className="text-muted-foreground">Status:</span>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  asset.status === "Active" ? "bg-green-100 text-green-800" :
                  asset.status === "Under Repair" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {asset.status}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {asset.purchaseDate && (
              <div>
                <h3 className="font-medium mb-2">Purchase Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Purchase Date:</span>
                  <span>{asset.purchaseDate}</span>
                  <span className="text-muted-foreground">Purchase Value:</span>
                  <span>${asset.purchaseValue?.toLocaleString()}</span>
                  <span className="text-muted-foreground">Current Value:</span>
                  <span>${asset.currentValue?.toLocaleString()}</span>
                </div>
              </div>
            )}

            {asset.lastMaintenance && (
              <div>
                <h3 className="font-medium mb-2">Maintenance</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Last Maintenance:</span>
                  <span>{asset.lastMaintenance}</span>
                  <span className="text-muted-foreground">Next Maintenance:</span>
                  <span>{asset.nextMaintenance}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

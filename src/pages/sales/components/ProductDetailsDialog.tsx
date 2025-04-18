
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SalesItem, ServiceRecord } from "../types";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, Clock, AlertTriangle, Check } from "lucide-react";

interface ProductDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: SalesItem | null;
  serviceRecords: ServiceRecord[];
}

export function ProductDetailsDialog({ 
  isOpen, 
  onClose, 
  item, 
  serviceRecords 
}: ProductDetailsDialogProps) {
  
  const [filteredRecords, setFilteredRecords] = useState<ServiceRecord[]>([]);

  useEffect(() => {
    if (item) {
      setFilteredRecords(serviceRecords.filter(record => record.saleId === item.id));
    }
  }, [item, serviceRecords]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-300";
      case "Expiring Soon":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Warranty Only":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Product Fully Written Off":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-red-100 text-red-800 border-red-300";
    }
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            Full details for {item.productName} (Serial No: {item.serialNo})
          </DialogDescription>
        </DialogHeader>
      
        <Tabs defaultValue="details">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="service">Service History</TabsTrigger>
          </TabsList>
        
          <TabsContent value="details">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{item.productName}</h3>
                  <p className="text-sm text-muted-foreground">Serial No: {item.serialNo}</p>
                </div>
                <Badge className={`${getStatusColor(item.status)}`}>
                  {item.status === "Expiring Soon" && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {item.status}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Client Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{item.client}</p>
                          <p className="text-sm text-muted-foreground">{item.contact}</p>
                        </div>
                      </div>
                      {item.clientBranch && (
                        <div>
                          <p className="text-sm font-medium">Branch:</p>
                          <Badge variant="outline" className="mt-1">
                            {item.clientBranch} ({item.clientBranchCode})
                          </Badge>
                        </div>
                      )}
                      {item.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Warranty & AMC Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Sale Date</p>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{item.saleDate}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Warranty Until</p>
                          <div className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{item.warrantyExpiry}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div>
                        <p className="text-sm font-medium">AMC Period:</p>
                        {item.amcStartDate === "N/A" ? (
                          <p className="text-sm text-muted-foreground">No AMC</p>
                        ) : (
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <div>
                              <p className="text-xs text-muted-foreground">From</p>
                              <span className="text-sm">{item.amcStartDate}</span>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">To</p>
                              <span className="text-sm">{item.amcExpiryDate}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {item.lastService && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">Last Service:</p>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p>{item.lastService}</p>
                        <p className="text-sm text-muted-foreground">{item.lastServiceNotes}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="service">
            {filteredRecords.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                No service records found for this product.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Parts Used</TableHead>
                    <TableHead>Next Due</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map(record => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.technician}</TableCell>
                      <TableCell>{record.description}</TableCell>
                      <TableCell>{record.partsUsed || "None"}</TableCell>
                      <TableCell>{record.nextServiceDue}</TableCell>
                      <TableCell>{record.remarks || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

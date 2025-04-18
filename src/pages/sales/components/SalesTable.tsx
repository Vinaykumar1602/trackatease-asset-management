
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { ShoppingCart, AlertTriangle, FileText, Search, Trash2, Eye } from "lucide-react";
import { SalesItem } from "../types";
import { ServiceDialogTrigger } from "./ServiceDialog";
import { DeleteSaleDialog } from "./DeleteSaleDialog";
import { EditSaleDialog } from "./EditSaleDialog";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SalesTableProps {
  items: SalesItem[];
  onEdit: (item: SalesItem) => void;
  onViewHistory: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: any) => void;
  clientBranches?: {id: number, name: string, code: string}[];
  onView?: (item: SalesItem) => void;
}

export function SalesTable({ 
  items, 
  onEdit, 
  onViewHistory, 
  onDelete, 
  onUpdate,
  clientBranches = [],
  onView 
}: SalesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product Name</TableHead>
          <TableHead>Serial No.</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Sale Date</TableHead>
          <TableHead>Warranty Expiry</TableHead>
          <TableHead>AMC Period</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Service</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center p-4 text-muted-foreground">
              No records found. Add a new sale record to get started.
            </TableCell>
          </TableRow>
        ) : (
          items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span>{item.productName}</span>
                </div>
                {item.location && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Location: {item.location}
                  </div>
                )}
              </TableCell>
              <TableCell>{item.serialNo}</TableCell>
              <TableCell>
                <div>
                  <p>{item.client}</p>
                  {item.clientBranch && item.clientBranchCode && (
                    <Badge variant="outline" className="mt-1">
                      {item.clientBranch} ({item.clientBranchCode})
                    </Badge>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{item.contact}</p>
                </div>
              </TableCell>
              <TableCell>{item.saleDate}</TableCell>
              <TableCell>{item.warrantyExpiry}</TableCell>
              <TableCell>
                {item.amcStartDate === "N/A" ? "No AMC" : `${item.amcStartDate} - ${item.amcExpiryDate}`}
              </TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${
                  item.status === "Active" ? "bg-green-100 text-green-800" :
                  item.status === "Expiring Soon" ? "bg-yellow-100 text-yellow-800" :
                  item.status === "Warranty Only" ? "bg-blue-100 text-blue-800" :
                  item.status === "Product Fully Written Off" ? "bg-purple-100 text-purple-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {item.status === "Expiring Soon" && <AlertTriangle className="h-3 w-3" />}
                  {item.status}
                </span>
              </TableCell>
              <TableCell>
                {item.lastService ? (
                  <div>
                    <p className="text-sm">{item.lastService}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">{item.lastServiceNotes}</p>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">No records</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => onViewHistory(item.id)}>
                        <FileText className="h-4 w-4 mr-1" />
                        History
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View service history</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <ServiceDialogTrigger saleItem={item} />
                
                <EditSaleDialog 
                  saleItem={item} 
                  onUpdate={onUpdate}
                  clientBranches={clientBranches}
                />
                
                {onView && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => onView(item)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View product details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                <DeleteSaleDialog 
                  saleId={item.id} 
                  saleName={item.productName}
                  onDelete={onDelete} 
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

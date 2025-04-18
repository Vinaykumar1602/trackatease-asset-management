import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { SaleFormData, SalesItem } from "../types";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search } from "lucide-react";

const statuses = [
  "Active", 
  "Expiring Soon", 
  "Warranty Only", 
  "Expired", 
  "Product Fully Written Off"
];

interface EditSaleDialogProps {
  saleItem: SalesItem;
  onUpdate: (id: number, data: SaleFormData) => void;
  clientBranches?: {id: number, name: string, code: string}[];
}

export function EditSaleDialog({ saleItem, onUpdate, clientBranches = [] }: EditSaleDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<SaleFormData>({
    productName: "",
    serialNo: "",
    client: "",
    clientBranch: "",
    clientBranchCode: "",
    contact: "",
    saleDate: "",
    warrantyExpiry: "",
    amcStartDate: "",
    amcExpiryDate: "",
    location: "",
    status: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBranches, setFilteredBranches] = useState(clientBranches);
  const [isSearching, setIsSearching] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setFormData({
        productName: saleItem.productName,
        serialNo: saleItem.serialNo,
        client: saleItem.client,
        clientBranch: saleItem.clientBranch || "",
        clientBranchCode: saleItem.clientBranchCode || "",
        contact: saleItem.contact,
        saleDate: saleItem.saleDate,
        warrantyExpiry: saleItem.warrantyExpiry,
        amcStartDate: saleItem.amcStartDate,
        amcExpiryDate: saleItem.amcExpiryDate,
        location: saleItem.location || "",
        status: saleItem.status
      });
    }
  }, [isOpen, saleItem]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = clientBranches.filter(branch => 
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBranches(filtered);
    } else {
      setFilteredBranches(clientBranches);
    }
  }, [searchTerm, clientBranches]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBranchSelect = (branch: {name: string, code: string}) => {
    setFormData(prev => ({
      ...prev,
      clientBranch: branch.name,
      clientBranchCode: branch.code
    }));
    setIsSearching(false);
  };

  const handleSubmit = () => {
    if (!formData.productName || !formData.serialNo || !formData.client) {
      toast({
        title: "Missing required fields",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    onUpdate(saleItem.id, formData);
    setIsOpen(false);
    
    toast({
      title: "Sale Updated",
      description: `${formData.productName} has been updated.`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Sale Record</DialogTitle>
          <DialogDescription>
            Update the details for {saleItem.productName} ({saleItem.serialNo}).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNo">Serial Number</Label>
              <Input
                id="serialNo"
                name="serialNo"
                value={formData.serialNo}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client Name</Label>
              <Input
                id="client"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientBranch">Client Branch</Label>
              <Popover open={isSearching} onOpenChange={setIsSearching}>
                <div className="flex gap-2">
                  <Input
                    value={formData.clientBranch ? `${formData.clientBranch} (${formData.clientBranchCode})` : ""}
                    readOnly
                    className="flex-1"
                  />
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                </div>
                <PopoverContent className="w-[300px] p-0" align="end">
                  <div className="p-2">
                    <Input
                      placeholder="Search branches..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mb-2"
                    />
                    <div className="max-h-[200px] overflow-y-auto">
                      {filteredBranches.length > 0 ? (
                        filteredBranches.map((branch) => (
                          <div
                            key={branch.id}
                            className="p-2 hover:bg-muted cursor-pointer rounded-md"
                            onClick={() => handleBranchSelect({name: branch.name, code: branch.code})}
                          >
                            <div>{branch.name}</div>
                            <div className="text-xs text-muted-foreground">{branch.code}</div>
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-muted-foreground text-center">No branches found</div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Person</Label>
              <Input
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Product location"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="saleDate">Sale Date</Label>
              <Input
                id="saleDate"
                name="saleDate"
                type="date"
                value={formData.saleDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
              <Input
                id="warrantyExpiry"
                name="warrantyExpiry"
                type="date"
                value={formData.warrantyExpiry}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amcStartDate">AMC Start Date</Label>
              <Input
                id="amcStartDate"
                name="amcStartDate"
                type="date"
                value={formData.amcStartDate}
                onChange={handleInputChange}
                placeholder="Leave empty for N/A"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amcExpiryDate">AMC Expiry Date</Label>
              <Input
                id="amcExpiryDate"
                name="amcExpiryDate"
                type="date"
                value={formData.amcExpiryDate}
                onChange={handleInputChange}
                placeholder="Leave empty for N/A"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData(prev => ({...prev, status: value}))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

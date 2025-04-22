
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
import { Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { SaleFormData, SalesItem } from "../types";
import { useToast } from "@/components/ui/use-toast";
import { ProductDetails } from "./edit/ProductDetails";
import { ClientInfo } from "./edit/ClientInfo";
import { DateInputs } from "./edit/DateInputs";

interface EditSaleDialogProps {
  saleItem: SalesItem;
  onUpdate: (id: string, data: SaleFormData) => void;
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

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value }));
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
          <ProductDetails
            formData={formData}
            handleInputChange={handleInputChange}
            handleStatusChange={handleStatusChange}
          />
          
          <ClientInfo
            formData={formData}
            handleInputChange={handleInputChange}
            handleBranchSelect={handleBranchSelect}
            clientBranches={clientBranches}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredBranches={filteredBranches}
            isSearching={isSearching}
            setIsSearching={setIsSearching}
          />
          
          <DateInputs
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

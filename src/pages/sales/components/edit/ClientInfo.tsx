
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ClientBranch {
  id: number;
  name: string;
  code: string;
}

interface ClientInfoProps {
  formData: {
    client: string;
    clientBranch?: string;  // Made optional to match SaleFormData
    clientBranchCode?: string;  // Made optional to match SaleFormData
    contact: string;
    location?: string;  // Made optional to match SaleFormData
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBranchSelect: (branch: {name: string, code: string}) => void;
  clientBranches: ClientBranch[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredBranches: ClientBranch[];
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
}

export function ClientInfo({ 
  formData,
  handleInputChange,
  handleBranchSelect,
  clientBranches,
  searchTerm,
  setSearchTerm,
  filteredBranches,
  isSearching,
  setIsSearching
}: ClientInfoProps) {
  return (
    <div className="grid gap-4">
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
                value={formData.clientBranch && formData.clientBranchCode ? `${formData.clientBranch} (${formData.clientBranchCode})` : ""}
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
            value={formData.location || ""}
            onChange={handleInputChange}
            placeholder="Product location"
          />
        </div>
      </div>
    </div>
  );
}

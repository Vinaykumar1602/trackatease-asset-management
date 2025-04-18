
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateInputsProps {
  formData: {
    saleDate: string;
    warrantyExpiry: string;
    amcStartDate: string;
    amcExpiryDate: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DateInputs({ formData, handleInputChange }: DateInputsProps) {
  return (
    <>
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
    </>
  );
}

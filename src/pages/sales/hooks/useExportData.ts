
import { useToast } from "@/components/ui/use-toast";
import { SalesItem, ServiceRecord } from "../types";

export function useExportData(salesItems: SalesItem[], serviceRecords: ServiceRecord[]) {
  const { toast } = useToast();

  const exportToCSV = (type: 'sales' | 'service') => {
    let csvContent = "";
    
    if (type === 'sales') {
      csvContent = "ID,Product Name,Serial No,Client,Branch,Branch Code,Contact,Sale Date,Warranty Expiry,AMC Start,AMC Expiry,Status,Location,Last Service\n";
      salesItems.forEach(item => {
        csvContent += `${item.id},"${item.productName}","${item.serialNo}","${item.client}","${item.clientBranch || ''}","${item.clientBranchCode || ''}","${item.contact}","${item.saleDate}","${item.warrantyExpiry}","${item.amcStartDate}","${item.amcExpiryDate}","${item.status}","${item.location || ''}","${item.lastService || 'N/A'}"\n`;
      });
    } else {
      csvContent = "ID,Product,Serial No,Client,Date,Technician,Description,Parts Used,Next Service Due,Remarks\n";
      serviceRecords.forEach(record => {
        const saleItem = salesItems.find(item => item.id === record.saleId);
        if (saleItem) {
          csvContent += `${record.id},"${saleItem.productName}","${saleItem.serialNo}","${saleItem.client}","${record.date}","${record.technician}","${record.description}","${record.partsUsed}","${record.nextServiceDue}","${record.remarks || ''}"\n`;
        }
      });
    }
    
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", type === 'sales' ? "sales_export.csv" : "service_records_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: `${type === 'sales' ? 'Sales records' : 'Service records'} have been exported to CSV.`
    });
  };

  return { exportToCSV };
}

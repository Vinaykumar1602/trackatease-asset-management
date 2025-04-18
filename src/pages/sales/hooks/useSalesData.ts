import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { SalesItem, ServiceRecord, SaleFormData, ServiceFormData, ImportFormat } from "../types";
import { calculateStatus } from "../utils/salesUtils";

export function useSalesData() {
  const [salesItems, setSalesItems] = useState<SalesItem[]>([
    { 
      id: 1, 
      productName: "Server System X1", 
      serialNo: "SRV-X1-2023-001", 
      client: "ABC Corporation",
      clientBranch: "Main Branch",
      clientBranchCode: "ABC-001",
      contact: "John Smith", 
      saleDate: "2023-01-15", 
      warrantyExpiry: "2024-01-15",
      amcStartDate: "2024-01-16",
      amcExpiryDate: "2025-01-15",
      status: "Active",
      location: "Server Room A, HQ Building",
      lastService: "2024-03-10", 
      lastServiceNotes: "Routine maintenance, replaced cooling fans"
    },
    { 
      id: 2, 
      productName: "Network Switch N500", 
      serialNo: "NSW-N500-2023-002", 
      client: "XYZ Inc",
      clientBranch: "South Division",
      clientBranchCode: "XYZ-002", 
      contact: "Jane Doe", 
      saleDate: "2023-02-10", 
      warrantyExpiry: "2024-02-10",
      amcStartDate: "2024-02-11",
      amcExpiryDate: "2025-02-10",
      status: "Active",
      location: "Network Closet 2, Floor 3",
      lastService: "2024-04-05",
      lastServiceNotes: "Firmware update and configuration check" 
    },
    { 
      id: 3, 
      productName: "Security Camera System", 
      serialNo: "CAM-S1-2023-003", 
      client: "123 Solutions",
      clientBranch: "Main Office",
      clientBranchCode: "123-HQ", 
      contact: "Bob Johnson", 
      saleDate: "2023-03-05", 
      warrantyExpiry: "2024-03-05",
      amcStartDate: "N/A",
      amcExpiryDate: "N/A",
      status: "Warranty Only",
      location: "Entrance Lobby, Main Building" 
    },
    { 
      id: 4, 
      productName: "Digital Signage System", 
      serialNo: "DSS-2022-004", 
      client: "City Mall",
      contact: "Mary Williams", 
      saleDate: "2022-12-12", 
      warrantyExpiry: "2023-12-12",
      amcStartDate: "2023-12-13",
      amcExpiryDate: "2024-12-12",
      status: "Expiring Soon",
      location: "Central Atrium, Level 2",
      lastService: "2024-01-20",
      lastServiceNotes: "Display calibration and software update" 
    },
    { 
      id: 5, 
      productName: "Laser Printer Pro", 
      serialNo: "LP-2022-005", 
      client: "ABC Corporation",
      clientBranch: "North Branch",
      clientBranchCode: "ABC-002", 
      contact: "Rachel Green", 
      saleDate: "2022-11-08", 
      warrantyExpiry: "2023-11-08",
      amcStartDate: "2023-11-09",
      amcExpiryDate: "2023-06-15",
      status: "Product Fully Written Off",
      location: "Admin Office 301" 
    }
  ]);

  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([
    {
      id: 1,
      saleId: 1,
      date: "2024-03-10",
      technician: "Mike Johnson",
      description: "Routine maintenance",
      partsUsed: "Cooling fans x2",
      nextServiceDue: "2024-09-10",
      remarks: "System performance optimal after component replacement."
    },
    {
      id: 2,
      saleId: 1,
      date: "2023-09-15",
      technician: "Mike Johnson",
      description: "Quarterly system check",
      partsUsed: "None",
      nextServiceDue: "2023-12-15",
      remarks: "All systems functioning within normal parameters."
    },
    {
      id: 3,
      saleId: 2,
      date: "2024-04-05",
      technician: "Sarah Wilson",
      description: "Firmware update and configuration check",
      partsUsed: "None",
      nextServiceDue: "2024-07-05",
      remarks: "Updated to firmware v3.2.1. Verified all ports working correctly."
    },
    {
      id: 4,
      saleId: 4,
      date: "2024-01-20",
      technician: "David Brown",
      description: "Display calibration and software update",
      partsUsed: "None",
      nextServiceDue: "2024-04-20",
      remarks: "Calibrated color settings and corrected display brightness issues."
    }
  ]);

  const { toast } = useToast();

  const handleAddSale = (formData: SaleFormData) => {
    const id = salesItems.length > 0 ? Math.max(...salesItems.map(item => item.id)) + 1 : 1;
    const status = formData.status || calculateStatus(formData);
    
    const newItem = { ...formData, id, status };
    setSalesItems(prev => [...prev, newItem]);
    
    toast({
      title: "Sale Added",
      description: `${newItem.productName} has been added to sales records.`
    });
  };

  const handleUpdateSale = (id: number, formData: SaleFormData) => {
    setSalesItems(prev => prev.map(item => {
      if (item.id === id) {
        const status = formData.status || calculateStatus(formData);
        return { ...item, ...formData, status };
      }
      return item;
    }));
    
    toast({
      title: "Sale Updated",
      description: "The sale record has been updated."
    });
  };

  const handleDeleteSale = (id: number) => {
    setSalesItems(prev => prev.filter(item => item.id !== id));
    setServiceRecords(prev => prev.filter(record => record.saleId !== id));
    
    toast({
      title: "Sale Deleted",
      description: "The sale record has been removed."
    });
  };

  const handleAddService = (formData: ServiceFormData) => {
    const id = serviceRecords.length > 0 ? Math.max(...serviceRecords.map(record => record.id)) + 1 : 1;
    const newRecord = { ...formData, id };
    
    setServiceRecords(prev => [...prev, newRecord]);
    
    setSalesItems(prev => prev.map(item => {
      if (item.id === formData.saleId) {
        return {
          ...item,
          lastService: formData.date,
          lastServiceNotes: formData.description
        };
      }
      return item;
    }));
  };

  const handleImportComplete = (data: ImportFormat[], type: 'sales' | 'service') => {
    if (type === 'sales') {
      const newSales = data.map((item, index) => {
        const maxId = salesItems.length > 0 ? Math.max(...salesItems.map(s => s.id)) : 0;
        return {
          id: maxId + index + 1,
          productName: item.productName || 'Unknown Product',
          serialNo: item.serialNo || `IMPORT-${Date.now()}-${index}`,
          client: item.client || 'Unknown Client',
          clientBranch: item.clientBranch || undefined,
          clientBranchCode: item.clientBranchCode || undefined,
          contact: item.contact || '',
          saleDate: item.saleDate || new Date().toISOString().split('T')[0],
          warrantyExpiry: item.warrantyExpiry || '',
          amcStartDate: item.amcStartDate || 'N/A',
          amcExpiryDate: item.amcExpiryDate || 'N/A',
          status: item.status || 'Active',
          location: item.location || undefined
        };
      });
      
      setSalesItems(prev => [...prev, ...newSales]);
    } else {
      const newServices = data.map((item, index) => {
        const maxId = serviceRecords.length > 0 ? Math.max(...serviceRecords.map(s => s.id)) : 0;
        return {
          id: maxId + index + 1,
          saleId: parseInt(item.saleId) || 1,
          date: item.date || new Date().toISOString().split('T')[0],
          technician: item.technician || 'Unknown',
          description: item.description || 'Service visit',
          partsUsed: item.partsUsed || '',
          nextServiceDue: item.nextServiceDue || '',
          remarks: item.remarks || ''
        };
      });
      
      setServiceRecords(prev => [...prev, ...newServices]);
      
      setSalesItems(prev => prev.map(item => {
        const latestService = [...serviceRecords, ...newServices]
          .filter(s => s.saleId === item.id)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
          
        if (latestService) {
          return {
            ...item,
            lastService: latestService.date,
            lastServiceNotes: latestService.description
          };
        }
        return item;
      }));
    }
    
    toast({
      title: "Import Successful",
      description: `${data.length} ${type} records have been imported.`
    });
  };

  return {
    salesItems,
    serviceRecords,
    handleAddSale,
    handleUpdateSale,
    handleDeleteSale,
    handleAddService,
    handleImportComplete
  };
}

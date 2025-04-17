
export interface SalesItem {
  id: number;
  productName: string;
  serialNo: string;
  client: string;
  contact: string;
  saleDate: string;
  warrantyExpiry: string;
  amcStartDate: string;
  amcExpiryDate: string;
  status: string;
  lastService?: string;
  lastServiceNotes?: string;
}

export interface ServiceRecord {
  id: number;
  saleId: number;
  date: string;
  technician: string;
  description: string;
  partsUsed: string;
  nextServiceDue: string;
}

export interface SaleFormData {
  productName: string;
  serialNo: string;
  client: string;
  contact: string;
  saleDate: string;
  warrantyExpiry: string;
  amcStartDate: string;
  amcExpiryDate: string;
}

export interface ServiceFormData {
  saleId: number;
  date: string;
  technician: string;
  description: string;
  partsUsed: string;
  nextServiceDue: string;
}

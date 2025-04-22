export interface SalesItem {
  id: string;  // Changed from number to string for UUID
  productName: string;
  serialNo: string;
  client: string;
  clientBranch?: string;
  clientBranchCode?: string;
  contact: string;
  saleDate: string;
  warrantyExpiry: string;
  amcStartDate: string;
  amcExpiryDate: string;
  status: string;
  location?: string;
  lastService?: string;
  lastServiceNotes?: string;
}

export interface ServiceRecord {
  id: string;  // Changed from number to string for UUID
  saleId: string;  // Changed from number to string for UUID
  date: string;
  technician: string;
  description: string;
  partsUsed: string;
  nextServiceDue: string;
  remarks?: string;
}

export interface SaleFormData {
  productName: string;
  serialNo: string;
  client: string;
  clientBranch?: string; 
  clientBranchCode?: string;
  contact: string;
  saleDate: string;
  warrantyExpiry: string;
  amcStartDate: string;
  amcExpiryDate: string;
  location?: string;
  status?: string;
}

export interface ServiceFormData {
  saleId: string;  // Changed from number to string for UUID
  date: string;
  technician: string;
  description: string;
  partsUsed: string;
  nextServiceDue: string;
  remarks?: string;
}

export interface ClientBranch {
  id: number;
  clientId: number;
  name: string;
  code: string;
  address: string;
}

export interface ImportFormat {
  [key: string]: string;
}

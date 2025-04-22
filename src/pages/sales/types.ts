
export interface SalesItem {
  id: string;  
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
  id: string;
  saleId: string;
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
  saleId: string;
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

// Service-related interfaces mapped to Supabase schema
export interface ServiceRequestData {
  id: string;
  asset_id: string | null;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  scheduled_date: string | null;
  completion_date: string | null;
  assigned_to: string | null;
  requested_by: string;
  created_at: string | null;
  updated_at: string | null;
}

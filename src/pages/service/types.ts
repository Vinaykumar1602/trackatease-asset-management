
export interface ServiceItem {
  id: string;
  client: string;
  product: string;
  serialNo: string;
  scheduledDate: string;
  technician: string;
  status: string;
  slaStatus: string;
  // Additional fields needed by serviceApi
  assetId?: string;
  priority?: string;
  completionDate?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  title?: string;
  assignedTo?: string;
}

export interface ServiceFormData {
  saleId?: string;
  assetId?: string;
  title?: string;
  date?: string;
  scheduledDate?: string;
  technician?: string;
  assignedTo?: string;
  description?: string;
  partsUsed?: string;
  nextServiceDue?: string;
  remarks?: string;
  status?: string;
  priority?: string;
}

export interface SalesData {
  customer_name?: string;
  product_name?: string;
  serial?: string;
  id?: string;
  quantity?: number;
  sale_date?: string;
  status?: string;
  amount?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CalendarService {
  id: string;
  assetId: string;
  scheduledDate: string;
  description: string;
  status: 'scheduled' | 'in progress' | 'completed' | 'cancelled' | 'pending' | 'overdue';
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

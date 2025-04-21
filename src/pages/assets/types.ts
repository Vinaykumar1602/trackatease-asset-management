
export interface Asset {
  id: number;
  name: string;
  category: string;
  serial: string;
  location: string;
  assignedTo: string;
  status: string;
  qrCodeUrl?: string;
  purchaseDate?: string;
  purchaseValue?: number;
  currentValue?: number;
  lastMaintenance?: string;
  nextMaintenance?: string;
  // Supabase UUID for database operations
  supabaseId?: string;
}

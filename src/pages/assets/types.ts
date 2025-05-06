
export interface Asset {
  id: string; // Changed from number to string to match Supabase UUID
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

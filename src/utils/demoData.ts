
import { User, Role, sampleUsers, sampleRoles } from "@/pages/users/types";

// Service requests sample data
export const sampleServiceRequests = [
  {
    id: "sr-001",
    title: "Printer Maintenance",
    description: "Regular maintenance for office printer",
    status: "Pending",
    priority: "Medium",
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    requestedBy: "usr-001",
    assignedTo: "tech-001",
    technician: "Alice Technician",
    product: "HP LaserJet Pro",
    serialNo: "HP78745698",
    slaStatus: "Within SLA",
    customer: "Finance Department"
  },
  {
    id: "sr-002",
    title: "Server Backup Failure",
    description: "Nightly backup failed for 3 consecutive nights",
    status: "In Progress",
    priority: "High",
    scheduledDate: new Date().toISOString().split('T')[0],
    requestedBy: "usr-002",
    assignedTo: "tech-002",
    technician: "Bob Service",
    product: "Dell PowerEdge Server",
    serialNo: "DL98734521",
    slaStatus: "Within SLA",
    customer: "IT Department"
  },
  {
    id: "sr-003",
    title: "Office AC Malfunction",
    description: "AC not cooling properly in meeting room 3",
    status: "Completed",
    priority: "Medium",
    scheduledDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    requestedBy: "usr-003",
    assignedTo: "tech-001",
    technician: "Alice Technician",
    product: "Daikin Inverter AC",
    serialNo: "DK20987612",
    slaStatus: "Met",
    customer: "Facilities"
  },
  {
    id: "sr-004",
    title: "Laptop Battery Replacement",
    description: "Battery draining too quickly, needs replacement",
    status: "Overdue",
    priority: "Low",
    scheduledDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    requestedBy: "usr-004",
    assignedTo: "tech-003",
    technician: "Charlie Repairs",
    product: "MacBook Pro",
    serialNo: "MAC87345612",
    slaStatus: "SLA Violated",
    customer: "Marketing Team"
  },
  {
    id: "sr-005",
    title: "Network Switch Configuration",
    description: "Configure new network switch for east wing",
    status: "Scheduled",
    priority: "High",
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    requestedBy: "usr-002",
    assignedTo: "tech-002",
    technician: "Bob Service",
    product: "Cisco Catalyst Switch",
    serialNo: "CS34675124",
    slaStatus: "Within SLA",
    customer: "IT Department"
  }
];

// Inventory sample data
export const sampleInventory = [
  {
    id: "inv-001",
    name: "HP Toner Cartridge",
    category: "Printer Supplies",
    quantity: 15,
    minQuantity: 5,
    location: "Storage Room A",
    supplier: "HP Supply Chain",
    unitPrice: 89.99,
    sku: "HP-TNR-1234",
    lastRestock: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "inv-002",
    name: "Dell Laptop Charger",
    category: "Computer Accessories",
    quantity: 8,
    minQuantity: 3,
    location: "Tech Storage",
    supplier: "Dell Inc.",
    unitPrice: 45.50,
    sku: "DL-CHRG-7890",
    lastRestock: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "inv-003",
    name: "Network Cable (Cat 6)",
    category: "Networking",
    quantity: 50,
    minQuantity: 10,
    location: "Storage Room B",
    supplier: "Network Solutions",
    unitPrice: 12.75,
    sku: "NET-CBL-6123",
    lastRestock: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "inv-004",
    name: "Server Hard Drive (1TB)",
    category: "Server Components",
    quantity: 4,
    minQuantity: 2,
    location: "Secure Storage",
    supplier: "Western Digital",
    unitPrice: 175.00,
    sku: "SRV-HD-9876",
    lastRestock: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "inv-005",
    name: "AAA Batteries",
    category: "Batteries",
    quantity: 120,
    minQuantity: 20,
    location: "Storage Room A",
    supplier: "Duracell",
    unitPrice: 0.95,
    sku: "BAT-AAA-4567",
    lastRestock: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "inv-006",
    name: "Wireless Mouse",
    category: "Computer Accessories",
    quantity: 7,
    minQuantity: 5,
    location: "Tech Storage",
    supplier: "Logitech",
    unitPrice: 22.99,
    sku: "LGT-MS-5678",
    lastRestock: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "inv-007",
    name: "Office Chair",
    category: "Furniture",
    quantity: 3,
    minQuantity: 2,
    location: "Warehouse",
    supplier: "Office Depot",
    unitPrice: 159.99,
    sku: "FURN-CHR-7823",
    lastRestock: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Assets sample data
export const sampleAssets = [
  {
    id: "asset-001",
    name: "HP LaserJet Pro Printer",
    category: "Printer",
    serialNo: "HP78745698",
    status: "Active",
    location: "Finance Department",
    assignedTo: "Finance Team",
    purchaseDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    purchaseValue: 499.99,
    currentValue: 299.99,
    lastMaintenance: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "asset-002",
    name: "Dell PowerEdge Server",
    category: "Server",
    serialNo: "DL98734521",
    status: "Active",
    location: "Server Room",
    assignedTo: "IT Department",
    purchaseDate: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString(),
    purchaseValue: 5499.99,
    currentValue: 2299.99,
    lastMaintenance: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    nextMaintenance: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "asset-003",
    name: "Daikin Inverter AC",
    category: "Air Conditioner",
    serialNo: "DK20987612",
    status: "Active",
    location: "Meeting Room 3",
    assignedTo: "Facilities",
    purchaseDate: new Date(Date.now() - 540 * 24 * 60 * 60 * 1000).toISOString(),
    purchaseValue: 1299.99,
    currentValue: 799.99,
    lastMaintenance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    nextMaintenance: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "asset-004",
    name: "MacBook Pro",
    category: "Laptop",
    serialNo: "MAC87345612",
    status: "Maintenance",
    location: "IT Workshop",
    assignedTo: "Marketing Director",
    purchaseDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    purchaseValue: 2199.99,
    currentValue: 1599.99,
    lastMaintenance: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    nextMaintenance: new Date(Date.now() + 170 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "asset-005",
    name: "Cisco Catalyst Switch",
    category: "Network Equipment",
    serialNo: "CS34675124",
    status: "Planned",
    location: "East Wing Network Closet",
    assignedTo: "Network Team",
    purchaseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    purchaseValue: 3499.99,
    currentValue: 3499.99,
    lastMaintenance: null,
    nextMaintenance: new Date(Date.now() + 355 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "asset-006",
    name: "Conference Room Projector",
    category: "Presentation Equipment",
    serialNo: "EP56781234",
    status: "Active",
    location: "Main Conference Room",
    assignedTo: "Facilities",
    purchaseDate: new Date(Date.now() - 450 * 24 * 60 * 60 * 1000).toISOString(),
    purchaseValue: 899.99,
    currentValue: 399.99,
    lastMaintenance: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    nextMaintenance: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Sales sample data
export const sampleSales = [
  {
    id: "sale-001",
    customer_name: "Acme Corporation",
    product_name: "HP LaserJet Pro",
    quantity: 2,
    amount: 999.98,
    sale_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Completed",
    created_by: "usr-001"
  },
  {
    id: "sale-002",
    customer_name: "Global Tech Solutions",
    product_name: "Dell PowerEdge Server",
    quantity: 1,
    amount: 5499.99,
    sale_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Completed",
    created_by: "usr-001"
  },
  {
    id: "sale-003",
    customer_name: "City Hospital",
    product_name: "Medical Grade Workstation",
    quantity: 5,
    amount: 11995.00,
    sale_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Pending",
    created_by: "usr-003"
  },
  {
    id: "sale-004",
    customer_name: "Educational Institute",
    product_name: "Student Chromebooks",
    quantity: 25,
    amount: 7475.00,
    sale_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Completed",
    created_by: "usr-002"
  },
  {
    id: "sale-005",
    customer_name: "Retail Chain Inc",
    product_name: "POS Terminal System",
    quantity: 10,
    amount: 15990.00,
    sale_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Serviced",
    created_by: "usr-001"
  },
  {
    id: "sale-006",
    customer_name: "Small Business LLC",
    product_name: "Office Network Setup",
    quantity: 1,
    amount: 3499.99,
    sale_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Completed",
    created_by: "usr-004"
  }
];

// Function to get demo data for any module
export const getDemoData = (module: 'users' | 'roles' | 'service' | 'inventory' | 'assets' | 'sales') => {
  switch (module) {
    case 'users':
      return sampleUsers;
    case 'roles':
      return sampleRoles;
    case 'service':
      return sampleServiceRequests;
    case 'inventory':
      return sampleInventory;
    case 'assets':
      return sampleAssets;
    case 'sales':
      return sampleSales;
    default:
      return [];
  }
};

// Helper function to initialize demo data in development environment
export const initializeDemoData = async () => {
  if (import.meta.env.DEV) {
    console.log('Initializing demo data for development environment');
    // You could add logic here to populate local storage
    // or make API calls to initialize data
    return true;
  }
  return false;
};

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
  },
  {
    id: "asset-007",
    name: "Enterprise Firewall System",
    category: "Network Security",
    serialNo: "FW98765432",
    status: "Active",
    location: "Server Room",
    assignedTo: "IT Security Team",
    purchaseDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    purchaseValue: 8499.99,
    currentValue: 7899.99,
    lastMaintenance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    nextMaintenance: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    amcDetails: {
      provider: "NetSecure Solutions",
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
      cost: 1299.99,
      coverage: "24/7 Support, Next Day Replacement, Software Updates"
    }
  },
  {
    id: "asset-008",
    name: "SAP Server Cluster",
    category: "Enterprise Server",
    serialNo: "SAP87654321",
    status: "Active",
    location: "Data Center",
    assignedTo: "Enterprise Systems",
    purchaseDate: new Date(Date.now() - 600 * 24 * 60 * 60 * 1000).toISOString(),
    purchaseValue: 74999.99,
    currentValue: 45000.00,
    lastMaintenance: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    nextMaintenance: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
    amcDetails: {
      provider: "SAP Enterprise Services",
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000).toISOString(),
      cost: 12499.99,
      coverage: "Premium Support, Hardware Replacement, System Upgrades, Quarterly Maintenance"
    }
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

// AMC Contracts sample data
export const sampleAMCContracts = [
  {
    id: "amc-001",
    assetId: "asset-007",
    assetName: "Enterprise Firewall System",
    provider: "NetSecure Solutions",
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
    cost: 1299.99,
    status: "Active",
    coverageDetails: "24/7 Support, Next Day Replacement, Software Updates",
    paymentFrequency: "Annual",
    contactPerson: "Mike Johnson",
    contactEmail: "mjohnson@netsecure.com",
    contactPhone: "+1-555-789-0123",
    notes: "Priority support included with 4-hour response time commitment"
  },
  {
    id: "amc-002",
    assetId: "asset-008",
    assetName: "SAP Server Cluster",
    provider: "SAP Enterprise Services",
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000).toISOString(),
    cost: 12499.99,
    status: "Active",
    coverageDetails: "Premium Support, Hardware Replacement, System Upgrades, Quarterly Maintenance",
    paymentFrequency: "Quarterly",
    contactPerson: "Sarah Williams",
    contactEmail: "swilliams@sapservices.com",
    contactPhone: "+1-555-456-7890",
    notes: "Includes quarterly system health check and optimization"
  },
  {
    id: "amc-003",
    assetId: "asset-002",
    assetName: "Dell PowerEdge Server",
    provider: "Dell ProSupport",
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString(),
    cost: 899.99,
    status: "Active",
    coverageDetails: "Next-Business-Day Support, Hardware Coverage, Technical Assistance",
    paymentFrequency: "Annual",
    contactPerson: "David Chen",
    contactEmail: "dchen@dellsupport.com",
    contactPhone: "+1-555-234-5678",
    notes: "Extended warranty included with parts replacement coverage"
  },
  {
    id: "amc-004",
    assetId: "asset-003",
    assetName: "Daikin Inverter AC",
    provider: "Cool Climate Services",
    startDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 245 * 24 * 60 * 60 * 1000).toISOString(),
    cost: 399.99,
    status: "Active",
    coverageDetails: "Bi-annual maintenance, Parts replacement, Emergency service",
    paymentFrequency: "Annual",
    contactPerson: "Lisa Rodriguez",
    contactEmail: "lrodriguez@coolclimate.com",
    contactPhone: "+1-555-987-6543",
    notes: "Includes filter replacement and refrigerant check-up"
  },
  {
    id: "amc-005",
    assetId: "asset-006",
    assetName: "Conference Room Projector",
    provider: "AV Maintenance Plus",
    startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000).toISOString(),
    cost: 249.99,
    status: "Active",
    coverageDetails: "Lamp replacement, Annual cleaning, Technical support",
    paymentFrequency: "Annual",
    contactPerson: "Robert Taylor",
    contactEmail: "rtaylor@avmplus.com",
    contactPhone: "+1-555-123-4567",
    notes: "Includes one free lamp replacement per year"
  }
];

// Technician schedule sample data
export const sampleTechnicianSchedules = [
  {
    id: "tech-001",
    name: "Alice Technician",
    email: "alice@company.com",
    phone: "555-123-4567",
    specialization: "IT Hardware",
    availability: "Weekdays",
    schedule: [
      {
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        slots: [
          { time: "09:00", serviceId: "sr-001", customer: "Finance Department" },
          { time: "11:00", serviceId: null, customer: null },
          { time: "14:00", serviceId: null, customer: null },
          { time: "16:00", serviceId: null, customer: null }
        ]
      },
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        slots: [
          { time: "09:00", serviceId: null, customer: null },
          { time: "11:00", serviceId: null, customer: null },
          { time: "14:00", serviceId: null, customer: null },
          { time: "16:00", serviceId: null, customer: null }
        ]
      }
    ]
  },
  {
    id: "tech-002",
    name: "Bob Service",
    email: "bob@company.com",
    phone: "555-234-5678",
    specialization: "Network Systems",
    availability: "Full-time",
    schedule: [
      {
        date: new Date(Date.now()).toISOString().split('T')[0],
        slots: [
          { time: "09:00", serviceId: "sr-002", customer: "IT Department" },
          { time: "11:00", serviceId: null, customer: null },
          { time: "14:00", serviceId: null, customer: null },
          { time: "16:00", serviceId: null, customer: null }
        ]
      },
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        slots: [
          { time: "09:00", serviceId: null, customer: null },
          { time: "11:00", serviceId: "sr-005", customer: "IT Department" },
          { time: "14:00", serviceId: null, customer: null },
          { time: "16:00", serviceId: null, customer: null }
        ]
      }
    ]
  },
  {
    id: "tech-003",
    name: "Charlie Repairs",
    email: "charlie@company.com",
    phone: "555-345-6789",
    specialization: "Mobile Devices",
    availability: "Part-time",
    schedule: [
      {
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        slots: [
          { time: "09:00", serviceId: "sr-004", customer: "Marketing Team" },
          { time: "11:00", serviceId: null, customer: null },
          { time: "14:00", serviceId: null, customer: null }
        ]
      }
    ]
  }
];

// Function to get demo data for any module
export const getDemoData = (module: 'users' | 'roles' | 'service' | 'inventory' | 'assets' | 'sales' | 'amc' | 'technicians') => {
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
    case 'amc':
      return sampleAMCContracts;
    case 'technicians':
      return sampleTechnicianSchedules;
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
    
    // Example of initializing data in Supabase if empty
    const { data: existingUsers } = await supabase.from('profiles').select('count').single();
    const userCount = existingUsers?.count || 0;
    
    if (userCount === 0) {
      console.log('No users found, initializing with demo data');
      // Initialize demo users
      // This is just an example - in practice, you would need to handle auth users separately
    }
    
    return true;
  }
  return false;
};

// Add initialization functions for each data type
export const initializeServiceData = async () => {
  try {
    const { data: existingServices } = await supabase
      .from('service_requests')
      .select('count')
      .single();
      
    const serviceCount = existingServices?.count || 0;
    
    if (serviceCount === 0 && import.meta.env.DEV) {
      console.log('No service records found, adding sample data');
      
      // Prepare service data with proper formatting for Supabase
      const serviceData = sampleServiceRequests.map(service => ({
        id: service.id,
        title: service.title,
        description: service.description,
        status: service.status,
        priority: service.priority,
        scheduled_date: service.scheduledDate,
        requested_by: service.requestedBy,
        assigned_to: service.assignedTo,
        completion_date: service.completionDate || null
      }));
      
      await supabase
        .from('service_requests')
        .insert(serviceData);
        
      console.log('Service sample data inserted successfully');
    }
  } catch (error) {
    console.error('Error initializing service data:', error);
  }
};

// Add initialization function for assets
export const initializeAssetData = async () => {
  try {
    const { data: existingAssets } = await supabase
      .from('assets')
      .select('count')
      .single();
      
    const assetCount = existingAssets?.count || 0;
    
    if (assetCount === 0 && import.meta.env.DEV) {
      console.log('No assets found, adding sample data');
      
      // Prepare asset data with proper formatting for Supabase
      const assetData = sampleAssets.map(asset => ({
        id: asset.id,
        name: asset.name,
        category: asset.category,
        serial: asset.serialNo,
        status: asset.status,
        location: asset.location,
        assigned_to: asset.assignedTo,
        purchase_date: asset.purchaseDate,
        purchase_value: asset.purchaseValue,
        current_value: asset.currentValue,
        last_maintenance: asset.lastMaintenance,
        next_maintenance: asset.nextMaintenance,
        created_by: 'system'
      }));
      
      await supabase
        .from('assets')
        .insert(assetData);
        
      console.log('Asset sample data inserted successfully');
    }
  } catch (error) {
    console.error('Error initializing asset data:', error);
  }
};

// Add initialization function for sales data
export const initializeSalesData = async () => {
  try {
    const { data: existingSales } = await supabase
      .from('sales')
      .select('count')
      .single();
      
    const salesCount = existingSales?.count || 0;
    
    if (salesCount === 0 && import.meta.env.DEV) {
      console.log('No sales found, adding sample data');
      
      // Prepare sales data with proper formatting for Supabase
      const salesData = sampleSales.map(sale => ({
        id: sale.id,
        customer_name: sale.customer_name,
        product_name: sale.product_name,
        quantity: sale.quantity,
        amount: sale.amount,
        sale_date: sale.sale_date,
        status: sale.status,
        created_by: sale.created_by
      }));
      
      await supabase
        .from('sales')
        .insert(salesData);
        
      console.log('Sales sample data inserted successfully');
    }
  } catch (error) {
    console.error('Error initializing sales data:', error);
  }
};

// Main initialization function
export const initializeAllDemoData = async () => {
  if (import.meta.env.DEV) {
    await initializeDemoData();
    await initializeServiceData();
    await initializeAssetData();
    await initializeSalesData();
    
    console.log('All demo data initialized');
    return true;
  }
  return false;
};


import { 
  Activity, 
  AlertCircle, 
  Box, 
  Calendar, 
  Clock, 
  Database, 
  Package, 
  ShieldAlert, 
  TrendingDown, 
  TrendingUp, 
  Wrench 
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import DashboardCard from "@/components/dashboard/DashboardCard";

// Sample data for charts
const assetData = [
  { name: "Jan", value: 210 },
  { name: "Feb", value: 270 },
  { name: "Mar", value: 290 },
  { name: "Apr", value: 340 },
  { name: "May", value: 380 },
  { name: "Jun", value: 420 },
  { name: "Jul", value: 450 }
];

const inventoryData = [
  { name: "Office", inStock: 120, lowStock: 18 },
  { name: "Warehouse", inStock: 350, lowStock: 10 },
  { name: "Store", inStock: 205, lowStock: 25 },
  { name: "Factory", inStock: 189, lowStock: 15 }
];

const upcomingServices = [
  { id: 1, client: "ABC Corp", asset: "Printer X500", date: "Jul 15, 2023", status: "Scheduled" },
  { id: 2, client: "XYZ Inc", asset: "Server Rack", date: "Jul 17, 2023", status: "Pending" },
  { id: 3, client: "123 Solutions", asset: "HVAC System", date: "Jul 20, 2023", status: "Confirmed" }
];

const expiringAMCs = [
  { id: 1, client: "ABC Corp", product: "Network System", expiry: "Jul 22, 2023" },
  { id: 2, client: "XYZ Inc", product: "Security Cameras", expiry: "Jul 30, 2023" },
  { id: 3, client: "123 Solutions", product: "Digital Signage", expiry: "Aug 5, 2023" }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your asset management overview at a glance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Assets" 
          value="487" 
          description="Fixed assets tracked"
          icon={Database}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Low Stock Items" 
          value="24" 
          description="Inventory below threshold"
          icon={AlertCircle}
          iconColor="text-yellow-500"
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard 
          title="Active AMCs" 
          value="86" 
          description="Annual maintenance contracts"
          icon={ShieldAlert}
          iconColor="text-green-500"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard 
          title="Pending Services" 
          value="19" 
          description="Scheduled maintenance"
          icon={Wrench}
          iconColor="text-blue-500"
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard 
          title="Asset Growth" 
          description="Total assets registered over time"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={assetData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#2563eb" fill="#3b82f6" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard 
          title="Inventory Status" 
          description="Current inventory levels by location"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={inventoryData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="inStock" name="In Stock" fill="#3b82f6" />
                <Bar dataKey="lowStock" name="Low Stock" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="Upcoming Service Visits"
          description="Services scheduled in next 7 days"
          footer={
            <div className="flex justify-end">
              <Button variant="outline" size="sm">View All Services</Button>
            </div>
          }
        >
          <div className="space-y-4">
            {upcomingServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{service.client}</p>
                    <p className="text-sm text-muted-foreground">{service.asset}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">{service.date}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Expiring AMCs"
          description="AMCs expiring in next 30 days"
          footer={
            <div className="flex justify-end">
              <Button variant="outline" size="sm">View All AMCs</Button>
            </div>
          }
        >
          <div className="space-y-4">
            {expiringAMCs.map((amc) => (
              <div key={amc.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{amc.client}</p>
                    <p className="text-sm text-muted-foreground">{amc.product}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">Expires</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                    {amc.expiry}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

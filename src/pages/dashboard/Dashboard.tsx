
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
  Wrench,
  Users,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import StatCard from "@/components/dashboard/StatCard";
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

// Sample data for system activities
const recentActivities = [
  { 
    id: 1, 
    type: "user_update", 
    title: "User updated",
    description: "John Doe updated profile",
    icon: Users,
    iconColor: "text-purple-500", 
    timestamp: "2h ago" 
  },
  { 
    id: 2, 
    type: "service_schedule", 
    title: "Service scheduled",
    description: "AC Maintenance - Sales Dept",
    icon: Calendar,
    iconColor: "text-green-500", 
    timestamp: "4h ago" 
  },
  { 
    id: 3, 
    type: "asset_added", 
    title: "New asset added",
    description: "Macbook Pro 16\" - Finance Department",
    icon: Box,
    iconColor: "text-blue-500", 
    timestamp: "6h ago" 
  },
  { 
    id: 4, 
    type: "user_update", 
    title: "User updated",
    description: "John Doe updated profile",
    icon: Users,
    iconColor: "text-purple-500", 
    timestamp: "8h ago" 
  },
  { 
    id: 5, 
    type: "inventory_update", 
    title: "Inventory updated",
    description: "10 Toner Cartridges added to stock",
    icon: Package,
    iconColor: "text-yellow-500", 
    timestamp: "12h ago" 
  }
];

// Sample data for system status overview
const statusOverview = [
  {
    id: 1,
    title: "Active Assets",
    value: 220,
    icon: CheckCircle,
    iconColor: "text-green-500"
  },
  {
    id: 2,
    title: "Assets Under Repair",
    value: 18,
    icon: Wrench,
    iconColor: "text-orange-500"
  },
  {
    id: 3,
    title: "Pending Services",
    value: 7,
    icon: Clock,
    iconColor: "text-blue-500"
  },
  {
    id: 4,
    title: "Low Stock Items",
    value: 12,
    icon: AlertTriangle,
    iconColor: "text-yellow-500"
  },
  {
    id: 5,
    title: "Active Users",
    value: 20,
    icon: Users,
    iconColor: "text-purple-500"
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin User!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Assets" 
          value="248" 
          description="220 active"
          icon={Database}
          iconColor="text-blue-500"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Inventory Alerts" 
          value="12" 
          description="items below min level"
          icon={AlertCircle}
          iconColor="text-red-500"
        />
        <StatCard 
          title="Active AMCs" 
          value="42" 
          description="5 expiring soon"
          icon={ShieldAlert}
          iconColor="text-green-500"
        />
        <StatCard 
          title="Upcoming Services" 
          value="15" 
          description="within next 7 days"
          icon={Calendar}
          iconColor="text-purple-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard 
          title="Recent Activities"
          description="Latest system activities and logs"
        >
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div className="flex items-start gap-2">
                  <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" size="sm">
              View All Activities
            </Button>
          </div>
        </DashboardCard>

        <DashboardCard 
          title="Status Overview"
          description="Current system status"
        >
          <div className="space-y-4">
            {statusOverview.map((status) => (
              <div key={status.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div className="flex items-center gap-2">
                  <status.icon className={`h-5 w-5 ${status.iconColor}`} />
                  <p className="font-medium">{status.title}</p>
                </div>
                <div>
                  <span className="text-xl font-bold">{status.value}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" size="sm" asChild>
              <Link to="/reports">View All Reports</Link>
            </Button>
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard 
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
        </DashboardCard>

        <DashboardCard 
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
        </DashboardCard>
      </div>
    </div>
  );
}

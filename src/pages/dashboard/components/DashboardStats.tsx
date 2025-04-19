
import { 
  Card, 
  CardContent,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Package, Database, ShoppingCart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

function StatCard({ title, value, subtitle, icon, trend, onClick }: StatCardProps) {
  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        {trend && (
          <div className="flex items-center text-xs mt-2">
            <span className={trend.isPositive ? "text-green-600" : "text-destructive"}>
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          className="absolute bottom-2 right-2 px-0 h-auto py-0 hover:bg-transparent"
          onClick={onClick}
        >
          View Details →
        </Button>
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  timeFilter: "week" | "month" | "year";
}

export function DashboardStats({ timeFilter }: DashboardStatsProps) {
  const navigate = useNavigate();
  
  // In a real app, these values would change based on the timeFilter
  const statsData = {
    week: {
      assets: "248",
      inventory: "12",
      amc: "42",
      services: "15"
    },
    month: {
      assets: "310",
      inventory: "24",
      amc: "65",
      services: "28"
    },
    year: {
      assets: "582",
      inventory: "76",
      amc: "138",
      services: "94"
    }
  };
  
  const currentStats = statsData[timeFilter];
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Assets"
        value={currentStats.assets}
        subtitle="220 active"
        icon={<Database className="h-6 w-6 text-primary" />}
        trend={{
          value: 12,
          isPositive: true
        }}
        onClick={() => {
          console.log("Navigate to assets page");
          navigate("/assets");
        }}
      />
      <StatCard
        title="Inventory Alerts"
        value={currentStats.inventory}
        subtitle="items below min level"
        icon={<Package className="h-6 w-6 text-red-500" />}
        onClick={() => {
          console.log("Navigate to inventory page");
          navigate("/inventory");
        }}
      />
      <StatCard
        title="Active AMCs"
        value={currentStats.amc}
        subtitle="5 expiring soon"
        icon={<ShoppingCart className="h-6 w-6 text-green-500" />}
        onClick={() => {
          console.log("Navigate to AMC page");
          navigate("/sales");
        }}
      />
      <StatCard
        title="Upcoming Services"
        value={currentStats.services}
        subtitle="within next 7 days"
        icon={<Calendar className="h-6 w-6 text-purple-500" />}
        onClick={() => {
          console.log("Navigate to services page");
          navigate("/service");
        }}
      />
    </div>
  );
}

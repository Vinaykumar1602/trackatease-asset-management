
import { 
  Card, 
  CardContent,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Package, Database, ShoppingCart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Assets"
        value="248"
        subtitle="220 active"
        icon={<Database className="h-6 w-6 text-primary" />}
        trend={{
          value: 12,
          isPositive: true
        }}
        onClick={() => console.log("Navigate to assets page")}
      />
      <StatCard
        title="Inventory Alerts"
        value="12"
        subtitle="items below min level"
        icon={<Package className="h-6 w-6 text-red-500" />}
        onClick={() => console.log("Navigate to inventory page")}
      />
      <StatCard
        title="Active AMCs"
        value="42"
        subtitle="5 expiring soon"
        icon={<ShoppingCart className="h-6 w-6 text-green-500" />}
        onClick={() => console.log("Navigate to AMC page")}
      />
      <StatCard
        title="Upcoming Services"
        value="15"
        subtitle="within next 7 days"
        icon={<Calendar className="h-6 w-6 text-purple-500" />}
        onClick={() => console.log("Navigate to services page")}
      />
    </div>
  );
}

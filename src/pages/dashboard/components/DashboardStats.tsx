
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Package, Calendar, ShieldAlert, BadgeAlert, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({ title, value, subtitle, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 p-1.5 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
      {trend && (
        <CardFooter>
          <div className="flex items-center text-xs">
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
            )}
            <span className={trend.isPositive ? "text-green-600" : "text-red-600"}>
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground ml-1">from previous month</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Assets"
        value="152"
        subtitle="126 active assets"
        icon={<Package className="h-5 w-5" />}
        trend={{
          value: 12,
          isPositive: true
        }}
      />
      <StatCard
        title="Inventory Alerts"
        value="12"
        subtitle="Items below minimum level"
        icon={<ShieldAlert className="h-5 w-5" />}
        trend={{
          value: 5,
          isPositive: false
        }}
      />
      <StatCard
        title="Active AMCs"
        value="37"
        subtitle="8 expiring soon"
        icon={<BadgeAlert className="h-5 w-5" />}
      />
      <StatCard
        title="Upcoming Services"
        value="15"
        subtitle="Scheduled in next 7 days"
        icon={<Calendar className="h-5 w-5" />}
      />
    </div>
  );
}

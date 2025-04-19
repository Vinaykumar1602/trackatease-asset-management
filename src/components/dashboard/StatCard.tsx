
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value?: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  subtitle?: string;
  metricValue?: string;
  metricChange?: string;
  status?: string;
  helperText?: string;
  chartData?: number[];
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  iconColor = "text-primary", 
  subtitle,
  metricValue,
  metricChange,
  status,
  helperText,
  chartData,
  trend 
}: StatCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className={cn("h-5 w-5", iconColor)} />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value || metricValue}</div>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {helperText && <p className="text-xs text-muted-foreground mt-1">{helperText}</p>}
        {trend && (
          <div className="flex items-center mt-1">
            <span
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">from last month</span>
          </div>
        )}
        {metricChange && (
          <div className="flex items-center mt-1">
            <span
              className={cn(
                "text-xs font-medium",
                metricChange.startsWith("+") ? "text-green-600" : "text-red-600"
              )}
            >
              {metricChange}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { MonitorCheck, TimerOff, Hourglass, Package, AlertCircle, Users } from "lucide-react";

interface StatusItem {
  label: string;
  value: number;
  icon: React.ReactNode;
}

export function StatusOverview() {
  // These would be fetched from API in a real app
  const statusItems: StatusItem[] = [
    {
      label: "Active Assets",
      value: 126,
      icon: <MonitorCheck className="h-5 w-5 text-green-600" />
    },
    {
      label: "Assets Under Repair",
      value: 8,
      icon: <TimerOff className="h-5 w-5 text-amber-600" />
    },
    {
      label: "Pending Services",
      value: 15,
      icon: <Hourglass className="h-5 w-5 text-blue-600" />
    },
    {
      label: "Low Stock Items",
      value: 12,
      icon: <AlertCircle className="h-5 w-5 text-red-600" />
    },
    {
      label: "Active Users",
      value: 24,
      icon: <Users className="h-5 w-5 text-purple-600" />
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Status Overview</CardTitle>
        <CardDescription>Current system status at a glance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statusItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-center p-4 border rounded-md bg-card hover:bg-accent/50 transition-colors">
              <div className="rounded-full bg-background p-2 mb-2">
                {item.icon}
              </div>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="text-xs text-center text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

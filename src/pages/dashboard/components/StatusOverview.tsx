
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { MonitorCheck, Wrench, Clock, AlertCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigateFunction } from "react-router-dom";

interface StatusItem {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  path?: string; // Navigation path
}

interface StatusOverviewProps {
  navigate: NavigateFunction;
}

export function StatusOverview({ navigate }: StatusOverviewProps) {
  const statusItems: StatusItem[] = [
    {
      label: "Active Assets",
      value: 220,
      icon: <MonitorCheck className="h-5 w-5 text-green-600" />,
      color: "text-green-600",
      path: "/assets"
    },
    {
      label: "Assets Under Repair",
      value: 18,
      icon: <Wrench className="h-5 w-5 text-amber-600" />,
      color: "text-amber-600",
      path: "/service"
    },
    {
      label: "Pending Services",
      value: 7,
      icon: <Clock className="h-5 w-5 text-blue-600" />,
      color: "text-blue-600",
      path: "/service"
    },
    {
      label: "Low Stock Items",
      value: 12,
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      color: "text-red-600",
      path: "/inventory"
    },
    {
      label: "Active Users",
      value: 20,
      icon: <Users className="h-5 w-5 text-purple-600" />,
      color: "text-purple-600",
      path: "/users"
    }
  ];

  const handleItemClick = (path?: string) => {
    if (path) {
      console.log(`Navigating to ${path}`);
      navigate(path);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Status Overview</CardTitle>
          <CardDescription>Current system status</CardDescription>
        </div>
        <Button 
          variant="ghost" 
          className="px-0 h-auto py-0 hover:bg-transparent"
          onClick={() => navigate('/reports')}
        >
          View All Reports →
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusItems.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between cursor-pointer hover:bg-accent/20 p-2 rounded-md"
              onClick={() => handleItemClick(item.path)}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full p-2 bg-background">
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
              <span className={`font-bold ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

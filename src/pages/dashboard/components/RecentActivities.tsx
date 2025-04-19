
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Wrench, User, CalendarClock, MoreHorizontal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Activity {
  id: number;
  type: "asset" | "inventory" | "user" | "service";
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

export function RecentActivities() {
  // This would be fetched from API in a real app
  const recentActivities: Activity[] = [
    {
      id: 1,
      type: "asset",
      title: "New Asset Added",
      description: "Dell Latitude 5420 laptop added to IT department",
      timestamp: "10 min ago",
      user: "John Smith"
    },
    {
      id: 2,
      type: "inventory",
      title: "Low Stock Alert",
      description: "Printer Ink Cartridges are below minimum stock level",
      timestamp: "25 min ago",
      user: "System"
    },
    {
      id: 3,
      type: "service",
      title: "Service Completed",
      description: "Quarterly maintenance for Server System X1 completed",
      timestamp: "1 hour ago",
      user: "Mike Johnson"
    },
    {
      id: 4,
      type: "user",
      title: "User Profile Updated",
      description: "Jane Doe updated their account details",
      timestamp: "2 hours ago",
      user: "Jane Doe"
    },
    {
      id: 5,
      type: "inventory",
      title: "Stock Added",
      description: "45 A4 Paper boxes added to inventory",
      timestamp: "3 hours ago",
      user: "David Brown"
    },
    {
      id: 6,
      type: "asset",
      title: "Asset Assigned",
      description: "Laptop SN: L-2023-005 assigned to Marketing department",
      timestamp: "4 hours ago",
      user: "John Smith"
    },
    {
      id: 7,
      type: "service",
      title: "Service Scheduled",
      description: "Maintenance scheduled for Network Switch N500",
      timestamp: "Yesterday",
      user: "Sarah Wilson"
    }
  ];

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "asset":
        return <Package className="h-4 w-4 text-blue-600" />;
      case "inventory":
        return <Package className="h-4 w-4 text-green-600" />;
      case "user":
        return <User className="h-4 w-4 text-purple-600" />;
      case "service":
        return <Wrench className="h-4 w-4 text-orange-600" />;
      default:
        return <CalendarClock className="h-4 w-4" />;
    }
  };

  const getActivityBadge = (type: Activity["type"]) => {
    switch (type) {
      case "asset":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Asset</Badge>;
      case "inventory":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Inventory</Badge>;
      case "user":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">User</Badge>;
      case "service":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Service</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Recent Activities</CardTitle>
          <CardDescription>Latest updates and changes in the system</CardDescription>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[365px] pr-4">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-3 rounded-md hover:bg-accent/50">
                <div className="mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{activity.title}</p>
                    {getActivityBadge(activity.type)}
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{activity.timestamp}</span>
                    <span>by {activity.user}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

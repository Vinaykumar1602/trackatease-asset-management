
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
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface Activity {
  id: number;
  type: "asset" | "inventory" | "user" | "service";
  title: string;
  description: string;
  timestamp: string;
  user: string;
  path: string; // Navigation path for each activity
  details?: string; // Additional details
}

interface RecentActivitiesProps {
  timeFilter: "week" | "month" | "year";
}

export function RecentActivities({ timeFilter }: RecentActivitiesProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  // This would be fetched from API in a real app
  const allActivities: Record<string, Activity[]> = {
    week: [
      {
        id: 1,
        type: "asset",
        title: "New Asset Added",
        description: "Dell Latitude 5420 laptop added to IT department",
        timestamp: "10 min ago",
        user: "John Smith",
        path: "/assets",
        details: "Asset ID: A-2023-0145\nSerial Number: LAT5420-XPS-2023\nAssigned to: IT Department\nStatus: Available\nAdded on: April 19, 2025"
      },
      {
        id: 2,
        type: "inventory",
        title: "Low Stock Alert",
        description: "Printer Ink Cartridges are below minimum stock level",
        timestamp: "25 min ago",
        user: "System",
        path: "/inventory",
        details: "Item: HP 67XL Black Ink Cartridge\nCurrent Stock: 3 units\nMinimum Stock Level: 5 units\nLast Ordered: April 10, 2025\nReorder Status: Pending"
      },
      {
        id: 3,
        type: "service",
        title: "Service Completed",
        description: "Quarterly maintenance for Server System X1 completed",
        timestamp: "1 hour ago",
        user: "Mike Johnson",
        path: "/service",
        details: "Service ID: S-2025-0078\nAsset: Server System X1\nMaintenance Type: Quarterly\nTechnician: Mike Johnson\nCompletion Date: April 19, 2025\nNext Service Due: July 19, 2025"
      },
      {
        id: 4,
        type: "user",
        title: "User Profile Updated",
        description: "Jane Doe updated their account details",
        timestamp: "2 hours ago",
        user: "Jane Doe",
        path: "/users",
        details: "User ID: U-2023-0067\nName: Jane Doe\nDepartment: Marketing\nUpdated Fields: Contact Information, Department Assignment\nLast Login: April 19, 2025"
      },
      {
        id: 5,
        type: "inventory",
        title: "Stock Added",
        description: "45 A4 Paper boxes added to inventory",
        timestamp: "3 hours ago",
        user: "David Brown",
        path: "/inventory",
        details: "Item: A4 Paper Boxes (500 sheets)\nQuantity Added: 45 boxes\nSupplier: Office Supplies Co.\nPurchase Order: PO-2025-0034\nReceived by: David Brown\nStorage Location: Warehouse B, Shelf 3"
      },
      {
        id: 6,
        type: "asset",
        title: "Asset Assigned",
        description: "Laptop SN: L-2023-005 assigned to Marketing department",
        timestamp: "4 hours ago",
        user: "John Smith",
        path: "/assets",
        details: "Asset ID: A-2023-0089\nAsset Type: Laptop\nSerial Number: L-2023-005\nAssigned to: Sarah Wilson\nDepartment: Marketing\nCondition: Excellent\nAssigned by: John Smith"
      },
      {
        id: 7,
        type: "service",
        title: "Service Scheduled",
        description: "Maintenance scheduled for Network Switch N500",
        timestamp: "Yesterday",
        user: "Sarah Wilson",
        path: "/service",
        details: "Service ID: S-2025-0079\nAsset: Network Switch N500\nMaintenance Type: Firmware Update\nScheduled Date: April 22, 2025\nPriority: Medium\nAssigned Technician: Mike Johnson\nEstimated Downtime: 30 minutes"
      }
    ],
    month: [
      // Additional activities for month view
      {
        id: 8,
        type: "asset",
        title: "Asset Decommissioned",
        description: "Old printer removed from Finance department",
        timestamp: "1 week ago",
        user: "Alex Peterson",
        path: "/assets",
        details: "Asset ID: A-2020-0054\nAsset Type: Printer\nModel: HP LaserJet Pro M404\nReason: End of life cycle\nDecommissioned by: Alex Peterson\nStatus: Scheduled for recycling"
      },
      {
        id: 9,
        type: "inventory",
        title: "Inventory Audit",
        description: "Monthly inventory audit completed",
        timestamp: "2 weeks ago",
        user: "Mary Johnson",
        path: "/inventory",
        details: "Audit ID: IA-2025-004\nAuditor: Mary Johnson\nDiscrepancies Found: 3 items\nResolution Status: Resolved\nNext Audit Date: May 15, 2025"
      },
    ],
    year: [
      // Additional activities for year view
      {
        id: 10,
        type: "user",
        title: "New Department Created",
        description: "R&D department added to the system",
        timestamp: "3 months ago",
        user: "Admin",
        path: "/users",
        details: "Department ID: D-2025-007\nDepartment Name: Research & Development\nHeadcount: 12\nLocation: Building B, 3rd Floor\nBudget Allocated: Yes\nCreated by: System Administrator"
      },
      {
        id: 11,
        type: "service",
        title: "Annual Maintenance",
        description: "Annual server room maintenance completed",
        timestamp: "6 months ago",
        user: "Technical Team",
        path: "/service",
        details: "Service ID: S-2024-0189\nType: Annual Preventive Maintenance\nScope: Server Room Infrastructure\nDuration: 72 hours\nCompletion Date: October 15, 2024\nNext Scheduled: October 2025"
      },
    ]
  };

  const recentActivities = allActivities[timeFilter] || allActivities.week;

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

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsDialogOpen(true);
  };

  const handleNavigateToPath = (path: string) => {
    setIsDialogOpen(false);
    setTimeout(() => {
      navigate(path);
    }, 100);
  };

  return (
    <>
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Activities</CardTitle>
            <CardDescription>Latest updates and changes in the system</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => navigate('/reports/activities')}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[365px] pr-4">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-4 p-3 rounded-md hover:bg-accent/50 cursor-pointer"
                  onClick={() => handleActivityClick(activity)}
                >
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedActivity?.title}</DialogTitle>
            <DialogDescription>{selectedActivity?.description}</DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/50">
                <pre className="whitespace-pre-wrap text-sm">
                  {selectedActivity?.details}
                </pre>
              </div>
              
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{selectedActivity?.timestamp} by {selectedActivity?.user}</span>
                {selectedActivity?.type && getActivityBadge(selectedActivity.type)}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Button 
                  onClick={() => selectedActivity && handleNavigateToPath(selectedActivity.path)}
                >
                  View Related Section
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

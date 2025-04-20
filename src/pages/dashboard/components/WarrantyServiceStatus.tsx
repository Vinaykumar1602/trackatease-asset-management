
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface WarrantyServiceItem {
  id: number;
  name: string;
  date: string;
  type: "warranty" | "service";
}

export function WarrantyServiceStatus() {
  // Mock data - in a real app, this would come from your backend
  const upcomingItems: WarrantyServiceItem[] = [
    { id: 1, name: "Printer X500", date: "2025-05-15", type: "warranty" },
    { id: 2, name: "Server Rack", date: "2025-04-25", type: "service" },
    { id: 3, name: "HVAC System", date: "2025-05-01", type: "warranty" },
  ];

  const getTimeLeft = (date: string) => {
    const days = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    return days;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expiring Warranties</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingItems
              .filter(item => item.type === "warranty")
              .map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Expires in {getTimeLeft(item.date)} days
                    </p>
                  </div>
                  <span className="text-yellow-600 text-sm">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Service Visits</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingItems
              .filter(item => item.type === "service")
              .map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Due in {getTimeLeft(item.date)} days
                    </p>
                  </div>
                  <span className="text-blue-600 text-sm">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

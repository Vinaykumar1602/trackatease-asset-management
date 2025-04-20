
import { DashboardStats } from "./components/DashboardStats";
import { StatusOverview } from "./components/StatusOverview";
import { RecentActivities } from "./components/RecentActivities";
import { WarrantyServiceStatus } from "./components/WarrantyServiceStatus";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business operations.</p>
      </div>

      <DashboardStats />
      <StatusOverview />
      <WarrantyServiceStatus />
      <RecentActivities />
    </div>
  );
}

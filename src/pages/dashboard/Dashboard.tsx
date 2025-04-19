
import { DashboardStats } from "./components/DashboardStats";
import { StatusOverview } from "./components/StatusOverview";
import { RecentActivities } from "./components/RecentActivities";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin User!</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent">
            This Week
          </button>
          <button className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent">
            This Month
          </button>
          <button className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent">
            This Year
          </button>
        </div>
      </div>

      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivities />
        <StatusOverview />
      </div>
    </div>
  );
}

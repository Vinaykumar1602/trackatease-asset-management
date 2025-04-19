
import { useState } from "react";
import { DashboardStats } from "./components/DashboardStats";
import { StatusOverview } from "./components/StatusOverview";
import { RecentActivities } from "./components/RecentActivities";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "year">("week");
  const navigate = useNavigate();

  const handleFilterChange = (filter: "week" | "month" | "year") => {
    setTimeFilter(filter);
    // In a real application, this would trigger data refetching based on the selected filter
    console.log(`Filter changed to: ${filter}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin User!</p>
        </div>
        <div className="flex gap-2">
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-lg ${timeFilter === "week" ? "bg-accent" : "hover:bg-accent"}`}
            onClick={() => handleFilterChange("week")}
          >
            This Week
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-lg ${timeFilter === "month" ? "bg-accent" : "hover:bg-accent"}`}
            onClick={() => handleFilterChange("month")}
          >
            This Month
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-lg ${timeFilter === "year" ? "bg-accent" : "hover:bg-accent"}`}
            onClick={() => handleFilterChange("year")}
          >
            This Year
          </button>
        </div>
      </div>

      <DashboardStats timeFilter={timeFilter} />

      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivities timeFilter={timeFilter} />
        <StatusOverview navigate={navigate} />
      </div>
    </div>
  );
}


import DashboardCard from "@/components/dashboard/DashboardCard";
import { DashboardStats } from "./components/DashboardStats";
import { StatusOverview } from "./components/StatusOverview";
import { RecentActivities } from "./components/RecentActivities";
import ChartCard from "@/components/dashboard/ChartCard";
import StatCard from "@/components/dashboard/StatCard";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import React from "react";

const barData = [
  {
    name: "Jan",
    active: 15,
    inactive: 5,
  },
  {
    name: "Feb",
    active: 22,
    inactive: 3,
  },
  {
    name: "Mar",
    active: 28,
    inactive: 4,
  },
  {
    name: "Apr",
    active: 32,
    inactive: 6,
  },
  {
    name: "May",
    active: 36,
    inactive: 3,
  },
  {
    name: "Jun",
    active: 42,
    inactive: 8,
  },
];

const lineData = [
  {
    name: "Week 1",
    services: 6,
    assets: 12,
  },
  {
    name: "Week 2",
    services: 8,
    assets: 14,
  },
  {
    name: "Week 3",
    services: 12,
    assets: 16,
  },
  {
    name: "Week 4",
    services: 9,
    assets: 19,
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">Welcome to Trackatease system dashboard</p>

      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-1 md:col-span-2 lg:col-span-5">
          <ChartCard
            title="Asset Status Overview"
            description="Current asset status across the organization"
            chart={
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="active" fill="#4ade80" name="Active Assets" />
                  <Bar dataKey="inactive" fill="#f87171" name="Inactive Assets" />
                </BarChart>
              </ResponsiveContainer>
            }
          />
        </div>

        <RecentActivities />

        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <ChartCard
            title="Services & Assets Trend"
            description="Weekly trend of services performed and assets managed"
            chart={
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="services" stroke="#8884d8" name="Services" />
                  <Line type="monotone" dataKey="assets" stroke="#82ca9d" name="New Assets" />
                </LineChart>
              </ResponsiveContainer>
            }
          />
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <StatCard
            title="Response Time"
            subtitle="Average time to respond to service requests"
            metricValue="4.2 hours"
            metricChange="-12%"
            status="success"
            helperText="Lower than last month"
            chartData={[10, 20, 15, 25, 18, 12, 8]}
          />
        </div>
      </div>

      <StatusOverview />
    </div>
  );
}

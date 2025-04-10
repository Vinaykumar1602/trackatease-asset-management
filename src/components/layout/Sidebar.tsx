
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { 
  BarChart2, 
  Box, 
  Calendar, 
  ClipboardList, 
  Database, 
  FileBarChart, 
  FileText, 
  Home, 
  Package2, 
  Settings, 
  ShoppingCart, 
  Users, 
  Wrench 
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

export default function SidebarNav() {
  const location = useLocation();
  
  const mainNavItems = [
    { title: "Dashboard", path: "/dashboard", icon: Home },
    { title: "Assets", path: "/assets", icon: Database },
    { title: "Inventory", path: "/inventory", icon: Package2 },
    { title: "Sales & AMC", path: "/sales", icon: ShoppingCart },
    { title: "Service", path: "/service", icon: Wrench },
    { title: "Reports", path: "/reports", icon: FileBarChart },
  ];
  
  const adminNavItems = [
    { title: "Users & Roles", path: "/users", icon: Users },
    { title: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <Sidebar className="shadow-lg border-r">
      <SidebarHeader className="flex items-center px-4 py-2">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
          <BarChart2 className="h-6 w-6 text-primary" />
          <span>TrackSure</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => 
                    cn("w-full flex items-center gap-2", 
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground")
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarSeparator />
        <SidebarMenu>
          {adminNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => 
                    cn("w-full flex items-center gap-2", 
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground")
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 text-xs text-white/70">
        <p>TrackSure v1.0</p>
      </SidebarFooter>
    </Sidebar>
  );
}

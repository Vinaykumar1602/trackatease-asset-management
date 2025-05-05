
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
    { title: "Dashboard", path: "/", icon: Home },
    { title: "Assets", path: "/assets", icon: Database },
    { title: "Inventory", path: "/inventory", icon: Package2 },
    { title: "Sales & AMC", path: "/sales", icon: ShoppingCart },
    { title: "Service", path: "/service", icon: Wrench },
    { title: "Reports", path: "/reports", icon: FileBarChart },
  ];
  
  // No longer separating admin items - all users have access to everything
  const systemNavItems = [
    { title: "Users & Roles", path: "/users", icon: Users },
    { title: "Settings", path: "/settings", icon: Settings },
    { title: "Admin", path: "/admin", icon: Settings },
  ];

  return (
    <Sidebar className="shadow-lg border-r">
      <SidebarHeader className="flex items-center px-4 py-2">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
          <BarChart2 className="h-6 w-6 text-primary" />
          <span>Trackatease</span>
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
          {systemNavItems.map((item) => (
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
        <p>Trackatease v1.0</p>
      </SidebarFooter>
    </Sidebar>
  );
}

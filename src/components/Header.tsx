
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import UserMenu from "./UserMenu";

interface HeaderProps {
  toggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export default function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
  const { user } = useAuth();
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        {toggleSidebar && (
          <div className="mr-4 flex md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              {isSidebarOpen ? 
                <X className="h-5 w-5" /> :
                <Menu className="h-5 w-5" />
              }
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>
        )}
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setNotificationOpen(!notificationOpen)}
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Toggle notifications</span>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
            </Button>
            
            {user && <UserMenu />}
          </div>
        </div>
      </div>
    </header>
  );
}

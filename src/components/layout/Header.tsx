
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Search, Settings, User, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { NotificationPopover } from '../notifications/NotificationPopover';

export default function Header() {
  const isMobile = useIsMobile();
  const [searchValue, setSearchValue] = useState("");
  const { user, profile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Ensure user data is displayed for debugging
  useEffect(() => {
    if (user) {
      console.log("Current user:", user.email);
      console.log("User ID:", user.id);
      console.log("Is admin:", isAdmin);
    }
  }, [user, isAdmin]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <SidebarTrigger>
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SidebarTrigger>
        <div className="flex-1 md:hidden">
          <h1 className="text-xl font-bold tracking-tight">Trackatease</h1>
        </div>
      </div>
      <div className={`flex items-center gap-2 md:ml-auto ${isMobile ? 'hidden' : 'flex-1'}`}>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg pl-8 md:w-[300px] lg:w-[400px]"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <NotificationPopover />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-primary text-white">
                  {profile ? getInitials(profile.name) : user?.email?.substring(0, 2).toUpperCase() || 'TA'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span>{profile ? profile.name : user?.email || 'Account'}</span>
                {isAdmin && (
                  <Badge variant="default" className="ml-1">
                    <ShieldCheck className="h-3 w-3 mr-1" /> Admin
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground font-normal">
                {user?.email}
              </span>
              {profile && profile.role && (
                <p className="text-xs text-muted-foreground mt-1 capitalize">{profile.role}</p>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavigate('/profile')}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigate('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()} className="text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

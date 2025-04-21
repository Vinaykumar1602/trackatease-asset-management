
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/useNotifications";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export function NotificationPopover() {
  const { notifications, unreadCount, markAsRead, clearAll, isLoading } = useNotifications();
  const { isAuthenticated } = useAuth();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {isAuthenticated && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="font-semibold">Notifications</h4>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {!isAuthenticated ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Login to see notifications
            </div>
          ) : isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`border-b p-4 ${
                  !notification.read ? "bg-muted/50" : ""
                } cursor-pointer hover:bg-muted/30`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start justify-between">
                  <h5 className="font-semibold">{notification.title}</h5>
                  <span className={`inline-flex h-2 w-2 rounded-full ${
                    notification.type === 'info' ? 'bg-blue-500' : 
                    notification.type === 'warning' ? 'bg-yellow-500' : 
                    notification.type === 'error' ? 'bg-red-500' : 
                    'bg-green-500'
                  }`} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.message}
                </p>
                <time className="text-xs text-muted-foreground">
                  {format(notification.timestamp, "MMM d, yyyy 'at' h:mm a")}
                </time>
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

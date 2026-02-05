import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Clock, Search, AlertTriangle, Crown, Check } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useUser } from "@/contexts/UserContext";
import type { Notification, NotificationType } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "drop_soon":
      return Clock;
    case "search_match":
      return Search;
    case "premium_warning":
      return AlertTriangle;
    case "upgrade_signal":
      return Crown;
    default:
      return Bell;
  }
}

function getNotificationColor(type: NotificationType) {
  switch (type) {
    case "drop_soon":
      return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
    case "search_match":
      return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
    case "premium_warning":
      return "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30";
    case "upgrade_signal":
      return "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30";
    default:
      return "text-muted-foreground bg-muted";
  }
}

export function NotificationBell() {
  const { isLoggedIn, isPro, triggerUpgrade } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);
  const [shouldPop, setShouldPop] = useState(false);
  const prevUnreadRef = useRef(0);

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    enabled: isLoggedIn,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("PATCH", `/api/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", "/api/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  useEffect(() => {
    if (unreadCount > 0 && unreadCount > prevUnreadRef.current) {
      setShouldShake(true);
      setShouldPop(true);
      const shakeTimer = setTimeout(() => setShouldShake(false), 600);
      const popTimer = setTimeout(() => setShouldPop(false), 300);
      prevUnreadRef.current = unreadCount;
      return () => {
        clearTimeout(shakeTimer);
        clearTimeout(popTimer);
      };
    }
    prevUnreadRef.current = unreadCount;
  }, [unreadCount]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.readAt) {
      markAsReadMutation.mutate(notification.id);
    }
    
    if (notification.type === "search_match" && !isPro) {
      triggerUpgrade("Unlock saved search alerts with Pro");
      return;
    }
    
    if (notification.type === "upgrade_signal") {
      triggerUpgrade(notification.message);
      return;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          data-testid="button-notifications"
        >
          <Bell className={`w-5 h-5 ${shouldShake ? 'animate-bell-shake' : ''}`} />
          {isLoggedIn && unreadCount > 0 && (
            <Badge 
              className={`absolute -top-1 -right-1 h-5 min-w-5 px-1.5 text-xs bg-destructive text-destructive-foreground border-0 ${shouldPop ? 'animate-badge-pop' : ''}`}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {isLoggedIn && unreadCount > 0 && (
            <button
              onClick={() => markAllAsReadMutation.mutate()}
              className="text-xs text-primary hover:underline"
              data-testid="button-mark-all-read"
            >
              Mark all as read
            </button>
          )}
        </div>
        <DropdownMenuSeparator />
        
        {!isLoggedIn ? (
          <div className="py-8 text-center">
            <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-3">Sign in to see notifications</p>
            <Button asChild size="sm">
              <a href="/api/login">Sign In</a>
            </Button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center">
            <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.slice(0, 10).map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const colorClass = getNotificationColor(notification.type);
              const isLocked = notification.type === "search_match" && !isPro;
              
              return (
                <DropdownMenuItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-start gap-3 p-3 cursor-pointer ${
                    !notification.readAt ? "bg-accent/50" : ""
                  }`}
                  data-testid={`notification-item-${notification.id}`}
                >
                  <div className={`p-2 rounded-full shrink-0 ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {notification.title}
                      </p>
                      {isLocked && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          Pro
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.readAt && (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

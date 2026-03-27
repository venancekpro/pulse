"use client";

import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger
        className="relative inline-flex size-9 items-center justify-center rounded-full border border-[var(--lumis-border)] bg-white/[0.05] text-[var(--lumis-text-dim)] transition-colors hover:bg-white/10 hover:text-[var(--lumis-text)]"
        aria-label="Notifications"
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-80 gap-0 p-0">
        <div className="flex items-center justify-between border-b border-[var(--lumis-border)] px-4 py-3">
          <span className="text-sm font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs"
              onClick={() => void markAsRead()}
            >
              Tout marquer lu
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              Aucune notification
            </p>
          ) : (
            <div>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "border-b border-[var(--lumis-border)] px-4 py-3 last:border-b-0",
                    !n.isRead && "bg-white/[0.03]",
                  )}
                >
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {n.message}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground/60">
                    {formatDistanceToNow(new Date(n.createdAt), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

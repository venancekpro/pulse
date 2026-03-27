"use client";

import { useCallback, useEffect } from "react";
import { useNotificationStore } from "@/stores/notification-store";
import type { Notification } from "@/types";

export function useNotifications() {
  const { notifications, unreadCount, setNotifications, setUnreadCount } =
    useNotificationStore();

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const json = (await res.json()) as {
        data: { notifications: Notification[]; unreadCount: number };
      };
      setNotifications(json.data.notifications);
      setUnreadCount(json.data.unreadCount);
    } catch {
      /* ignore */
    }
  }, [setNotifications, setUnreadCount]);

  const markAsRead = useCallback(
    async (ids?: string[]) => {
      await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ids ? { ids } : { all: true }),
      });
      await load();
    },
    [load],
  );

  useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), 30_000);
    return () => clearInterval(interval);
  }, [load]);

  return { notifications, unreadCount, reload: load, markAsRead };
}

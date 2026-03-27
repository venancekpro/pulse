import { create } from "zustand";
import type { Notification } from "@/types";

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (n: Notification[]) => void;
  setUnreadCount: (c: number) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) => set({ notifications }),
  setUnreadCount: (unreadCount) => set({ unreadCount }),
}));

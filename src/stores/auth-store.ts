import { create } from "zustand";
import type { User } from "@/types";

type AuthStore = {
  user: User | null;
  setUser: (u: User | null) => void;
  isLoading: boolean;
  setLoading: (v: boolean) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isLoading: true,
  setLoading: (isLoading) => set({ isLoading }),
}));

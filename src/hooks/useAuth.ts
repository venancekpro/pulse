"use client";

import { useCallback, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import type { User } from "@/types";

/** Single session bootstrap: every consumer used to call refresh(), which set isLoading and unmounted the shell (infinite loop). */
let sessionBootstrapStarted = false;

export function useAuth() {
  const { user, setUser, isLoading, setLoading } = useAuthStore();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        setUser(null);
        return;
      }
      const json = (await res.json()) as { success: boolean; data?: User };
      setUser(json.data ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  useEffect(() => {
    if (sessionBootstrapStarted) return;
    sessionBootstrapStarted = true;
    void refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/login";
  }, [setUser]);

  return { user, isLoading, refresh, logout };
}

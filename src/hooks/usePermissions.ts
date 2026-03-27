"use client";

import { can } from "@/lib/permissions";
import { useAuth } from "@/hooks/useAuth";
import type { Permission } from "@/types";

export function usePermissions() {
  const { user } = useAuth();
  return {
    can: (p: Permission) => can(user?.role, p),
    role: user?.role,
    isAdmin: user?.role === "admin",
  };
}

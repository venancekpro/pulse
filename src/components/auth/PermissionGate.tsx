"use client";

import type { ReactNode } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import type { Permission } from "@/types";
import { AccessDenied } from "@/components/auth/AccessDenied";

export function PermissionGate({
  permission,
  children,
  fallback,
}: {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { can } = usePermissions();
  if (!can(permission)) {
    return fallback ?? <AccessDenied />;
  }
  return <>{children}</>;
}

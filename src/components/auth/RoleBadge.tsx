"use client";

import { Badge } from "@/components/ui/badge";
import { ROLE_COLORS } from "@/lib/constants";
import type { UserRole } from "@/types";

export function RoleBadge({ role }: { role: UserRole }) {
  const label = role === "admin" ? "Admin" : "Lecture seule";
  return (
    <Badge
      variant="secondary"
      className="text-xs font-medium"
      style={{ borderColor: ROLE_COLORS[role], color: ROLE_COLORS[role] }}
    >
      {label}
    </Badge>
  );
}

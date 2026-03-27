"use client";

import { Badge } from "@/components/ui/badge";
import { LOAD_COLORS, LOAD_LABELS } from "@/lib/constants";
import type { LoadLevel } from "@/types";

export function LoadBadge({ level }: { level: LoadLevel }) {
  return (
    <Badge
      variant="outline"
      className="font-medium border-2"
      style={{ borderColor: LOAD_COLORS[level], color: LOAD_COLORS[level] }}
    >
      {LOAD_LABELS[level]}
    </Badge>
  );
}

"use client";

import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { daysUntil } from "@/lib/utils/date-helpers";

export function DeadlineBadge({ deadline }: { deadline: Date | string }) {
  const d = typeof deadline === "string" ? new Date(deadline) : deadline;
  const diff = daysUntil(d);
  if (diff < 0) {
    return <Badge variant="destructive">Dépassé</Badge>;
  }
  if (diff <= 14) {
    return (
      <Badge variant="secondary" className="bg-amber-500/15 text-amber-700 border-amber-500/40">
        {formatDistanceToNow(d, { addSuffix: true, locale: fr })}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-muted-foreground">
      {formatDistanceToNow(d, { addSuffix: true, locale: fr })}
    </Badge>
  );
}

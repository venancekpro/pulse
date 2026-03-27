"use client";

import { Progress } from "@/components/ui/progress";
import type { MemberWithLoad } from "@/types";

export function IsoActionsProgress({ member }: { member: MemberWithLoad }) {
  const iso = member.isoActions;
  if (!iso || iso.total === 0) {
    return <p className="text-sm text-muted-foreground">Pas d&apos;actions ISO suivies</p>;
  }
  const pct = Math.round((iso.completed / iso.total) * 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Actions ISO 9001</span>
        <span className="font-medium">
          {iso.completed}/{iso.total}
        </span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );
}

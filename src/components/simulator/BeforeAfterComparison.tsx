"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadBadge } from "@/components/dashboard/LoadBadge";
import type { MemberLoadState } from "@/types";

function Col({ label, rows }: { label: string; rows: MemberLoadState[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-80 overflow-y-auto text-xs">
        {rows.map((r) => (
          <div key={r.memberId} className="flex items-center justify-between gap-2 border-b border-border pb-2">
            <span className="truncate">{r.memberName}</span>
            <span className="shrink-0 flex items-center gap-2">
              {r.currentLoad}%
              <LoadBadge level={r.loadLevel} />
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function BeforeAfterComparison({
  before,
  after,
}: {
  before: MemberLoadState[];
  after: MemberLoadState[];
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Col label="Avant simulation" rows={before} />
      <Col label="Après simulation" rows={after} />
    </div>
  );
}

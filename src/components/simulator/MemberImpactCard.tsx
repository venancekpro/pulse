"use client";

import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LOAD_COLORS } from "@/lib/constants";
import type { MemberImpact } from "@/types";

export function MemberImpactCard({ impact }: { impact: MemberImpact }) {
  return (
    <Card>
      <CardContent className="py-4 text-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium">{impact.memberName}</span>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded"
            style={{
              backgroundColor: `${LOAD_COLORS[impact.projectedLevel]}22`,
              color: LOAD_COLORS[impact.projectedLevel],
            }}
          >
            {impact.recommendation}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>{impact.currentLoad}%</span>
          <ChevronRight className="size-4" />
          <span className="text-foreground font-semibold">{impact.projectedLoad}%</span>
          <span className="text-xs">(+{impact.loadIncrease})</span>
        </div>
      </CardContent>
    </Card>
  );
}

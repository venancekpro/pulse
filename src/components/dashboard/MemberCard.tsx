"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { POLE_LABELS } from "@/lib/constants";
import { LoadBadge } from "@/components/dashboard/LoadBadge";
import type { MemberWithLoad } from "@/types";

export function MemberCard({ member }: { member: MemberWithLoad }) {
  return (
    <Link href={`/team/${member.id}`} className="lumis-interactive-card block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--lumis-accent)]/50">
      <Card className="h-full cursor-pointer hover:border-[var(--lumis-accent)]/25">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center justify-between gap-2">
            {member.name}
            <LoadBadge level={member.loadLevel} />
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>{POLE_LABELS[member.pole]}</p>
          <p>
            Charge calculée : <span className="font-medium text-foreground">{member.calculatedLoad}%</span>
          </p>
          <p>
            Projets actifs : {member.projectCount}
            {member.urgentProjectCount > 0 ? ` · ${member.urgentProjectCount} urgents` : ""}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/date-helpers";
import type { MemberWithLoad } from "@/types";

export function MemberProjects({ member }: { member: MemberWithLoad }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Affectations projets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {member.assignments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune affectation</p>
        ) : (
          member.assignments.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <div>
                <Link href={`/projects/${a.projectId}`} className="font-medium hover:underline">
                  {a.project?.name ?? a.projectId}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {a.role} · {a.allocation}% · échéance{" "}
                  {a.project?.deadline ? formatDate(a.project.deadline) : "—"}
                </p>
              </div>
              {a.isUrgent && <Badge variant="destructive">Urgent</Badge>}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { POLE_LABELS } from "@/lib/constants";
import { LoadBadge } from "@/components/dashboard/LoadBadge";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditMemberModal } from "@/components/team/EditMemberModal";
import { IsoActionsProgress } from "@/components/team/IsoActionsProgress";
import { LoadChart } from "@/components/team/LoadChart";
import { MemberProjects } from "@/components/team/MemberProjects";
import { PermissionGate } from "@/components/auth/PermissionGate";
import type { MemberWithLoad } from "@/types";

export function MemberDetail({
  member,
  onReload,
}: {
  member: MemberWithLoad;
  onReload: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <PageHeader label="Membre" title={member.name} description={POLE_LABELS[member.pole]} />
          <div className="flex flex-wrap gap-2">
            {member.roles.map((r) => (
              <span
                key={r}
                className="rounded-xl border border-[var(--lumis-border)] bg-white/[0.04] px-2.5 py-1 text-xs font-semibold backdrop-blur-sm"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LoadBadge level={member.loadLevel} />
          <PermissionGate permission="EDIT_MEMBER_LOAD">
            <EditMemberModal member={member} onSaved={onReload} />
          </PermissionGate>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Charge calculée</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold">{member.calculatedLoad}%</p>
            <LoadChart load={member.calculatedLoad} level={member.loadLevel} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Suivi</CardTitle>
          </CardHeader>
          <CardContent>
            <IsoActionsProgress member={member} />
            {member.transversalRoles.length > 0 && (
              <div className="mt-4 text-sm">
                <p className="font-medium mb-1">Rôles transverses</p>
                <ul className="list-disc pl-4 text-muted-foreground">
                  {member.transversalRoles.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <MemberProjects member={member} />
    </div>
  );
}

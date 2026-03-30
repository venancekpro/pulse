"use client";

import { useEffect, useState } from "react";
import { POLE_LABELS } from "@/lib/constants";
import { LoadBadge } from "@/components/dashboard/LoadBadge";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditMemberModal } from "@/components/team/EditMemberModal";
import { IsoActionsProgress } from "@/components/team/IsoActionsProgress";
import { LoadChart } from "@/components/team/LoadChart";
import { MemberProjects } from "@/components/team/MemberProjects";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { LeaveCalendar } from "@/components/team/LeaveCalendar";
import { LeaveList } from "@/components/team/LeaveList";
import { AddLeaveDialog } from "@/components/team/AddLeaveDialog";
import { ReliabilityBadge } from "@/components/team/ReliabilityBadge";
import { SkillBadge } from "@/components/skills/SkillBadge";
import { EditSkillsDialog } from "@/components/skills/EditSkillsDialog";
import { usePermissions } from "@/hooks/usePermissions";
import type { MemberWithLoad, ReliabilityScore } from "@/types";

export function MemberDetail({
  member,
  onReload,
}: {
  member: MemberWithLoad;
  onReload: () => void;
}) {
  const { can } = usePermissions();
  const [reliability, setReliability] = useState<ReliabilityScore | null>(null);

  useEffect(() => {
    fetch(`/api/members/${member.id}/reliability`)
      .then((r) => r.json())
      .then((json) => { if (json.success) setReliability(json.data); })
      .catch(() => {});
  }, [member.id]);

  const showEffective = member.effectiveLoad !== member.calculatedLoad;

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
            <CardTitle className="text-base">Charge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-bold">{member.effectiveLoad}%</p>
              {showEffective && (
                <p className="text-sm text-muted-foreground">(brute: {member.calculatedLoad}%)</p>
              )}
              {member.isOnLeave && (
                <span className="text-xs text-amber-500 font-medium">En absence</span>
              )}
            </div>
            <LoadChart load={member.effectiveLoad} level={member.loadLevel} />
            {reliability && <ReliabilityBadge score={reliability} showDetails />}
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

      {/* Competences */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Compétences</CardTitle>
          <PermissionGate permission="EDIT_MEMBER_LOAD">
            <EditSkillsDialog memberId={member.id} currentSkills={member.skills} onSaved={onReload} />
          </PermissionGate>
        </CardHeader>
        <CardContent>
          {member.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {member.skills.map((s) => (
                <SkillBadge key={s.name} skill={s} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune compétence renseignée</p>
          )}
        </CardContent>
      </Card>

      {/* Absences */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Absences</CardTitle>
          <PermissionGate permission="EDIT_MEMBER_LOAD">
            <AddLeaveDialog memberId={member.id} onAdded={onReload} />
          </PermissionGate>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            <LeaveCalendar leaves={member.leaves ?? []} />
            <LeaveList
              memberId={member.id}
              leaves={member.leaves ?? []}
              onChanged={onReload}
              canEdit={can("EDIT_MEMBER_LOAD")}
            />
          </div>
        </CardContent>
      </Card>

      <MemberProjects member={member} />
    </div>
  );
}

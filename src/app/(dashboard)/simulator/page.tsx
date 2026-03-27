"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { AccessDenied } from "@/components/auth/AccessDenied";
import { SimulatorForm } from "@/components/simulator/SimulatorForm";
import { useTeamData } from "@/hooks/useTeamData";

export default function SimulatorPage() {
  const { members, error } = useTeamData();

  return (
    <div className="space-y-6">
      <PageHeader
        label="Planification"
        title="Simulateur d’impact"
        description="Anticipez la charge avant d’assigner un nouveau projet (administrateurs uniquement)."
      />
      <PermissionGate permission="USE_SIMULATOR" fallback={<AccessDenied />}>
        {error || !members ? (
          <p className="text-muted-foreground">{error ?? "Chargement…"}</p>
        ) : (
          <SimulatorForm members={members} />
        )}
      </PermissionGate>
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SimulationSummary } from "@/types";

export function ImpactPreview({ summary }: { summary: SimulationSummary }) {
  return (
    <Card className="border-[var(--pulse-primary)]/30">
      <CardHeader>
        <CardTitle className="text-base">Synthèse</CardTitle>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground">Membres impactés</p>
          <p className="text-xl font-semibold">{summary.totalMembersAffected}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Risque</p>
          <p className="text-xl font-semibold capitalize">{summary.riskLevel}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Surcharge nouvelle</p>
          <p className="text-xl font-semibold">{summary.membersEnteringOverload}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Hausse moyenne</p>
          <p className="text-xl font-semibold">+{summary.averageLoadIncrease}%</p>
        </div>
        <div className="sm:col-span-2">
          <p className={summary.canProceed ? "text-emerald-600" : "text-destructive"}>
            {summary.canProceed
              ? "Le scénario peut être envisagé avec vigilance."
              : "Scénario très risqué : ajuster les affectations avant go-live."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

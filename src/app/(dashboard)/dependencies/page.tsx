"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SPOFAlertList } from "@/components/dependencies/SPOFAlertList";
import { DependencyGraph } from "@/components/dependencies/DependencyGraph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DependencyRadarResult } from "@/types";

export default function DependenciesPage() {
  const [data, setData] = useState<DependencyRadarResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports/spof")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setData(json.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader title="Radar de dépendances" description="Détection des points de défaillance uniques (SPOF)" />

      <p className="text-sm text-muted-foreground leading-relaxed">
        <strong>SPOF (Single Point of Failure)</strong> : un membre qui est le seul à pouvoir assurer un projet ou une compétence critique. S&apos;il part en congé ou quitte l&apos;équipe, le projet est bloqué.
      </p>

      {loading && <div className="text-sm text-muted-foreground">Chargement...</div>}

      {data && (
        <>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <Card className="py-3">
              <CardContent className="px-4 py-0 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">SPOF détectés</span>
                <span className="text-xl font-bold">{data.totalSPOFs}</span>
              </CardContent>
            </Card>
            <Card className="py-3">
              <CardContent className="px-4 py-0 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">SPOF critiques</span>
                <span className="text-xl font-bold text-destructive">{data.criticalSPOFs}</span>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm">Alertes SPOF</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <SPOFAlertList alerts={data.spofAlerts} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm">Graphe des dépendances</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <DependencyGraph edges={data.edges} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

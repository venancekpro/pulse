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
    <div className="space-y-6">
      <PageHeader title="Radar de dépendances" description="Détection des points de défaillance uniques (SPOF)" />

      {loading && <div className="text-sm text-muted-foreground">Chargement...</div>}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">SPOF détectés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalSPOFs}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">SPOF critiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{data.criticalSPOFs}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Alertes SPOF</CardTitle>
            </CardHeader>
            <CardContent>
              <SPOFAlertList alerts={data.spofAlerts} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Graphe des dépendances</CardTitle>
            </CardHeader>
            <CardContent>
              <DependencyGraph edges={data.edges} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

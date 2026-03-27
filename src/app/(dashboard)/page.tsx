"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { PageHeader } from "@/components/layout/PageHeader";
import { PoleSection } from "@/components/dashboard/PoleSection";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTeamData } from "@/hooks/useTeamData";
import type { DashboardStats, LoadLevel, Pole } from "@/types";

export default function DashboardPage() {
  const { members, error } = useTeamData();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [poleFilter, setPoleFilter] = useState<Pole | "all">("all");
  const [loadFilter, setLoadFilter] = useState<LoadLevel | "all">("all");

  useEffect(() => {
    void (async () => {
      setStatsLoading(true);
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const json = (await res.json()) as { data: DashboardStats };
          setStats(json.data);
        }
      } catch {
        /* réseau / reboot dev server — évite unhandledRejection */
      } finally {
        setStatsLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!members) return [];
    return members.filter((m) => {
      if (poleFilter !== "all" && m.pole !== poleFilter) return false;
      if (loadFilter !== "all" && m.loadLevel !== loadFilter) return false;
      return true;
    });
  }, [members, poleFilter, loadFilter]);

  const poles: Pole[] = ["front", "back", "devops", "ux-ui"];

  if (error) {
    return (
      <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {error}
      </p>
    );
  }

  if (!members) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        label="Vue d’ensemble"
        title="Dashboard"
        description="Vue consolidée de la charge SDIVT — surcharge, pôles et filtres."
      />

      {statsLoading || !stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[var(--lumis-border)] border-l-[3px] border-l-[var(--lumis-accent)]/35 bg-card/50 p-4 shadow-sm backdrop-blur-md dark:bg-[color-mix(in_srgb,var(--lumis-card-glass)_88%,transparent)]"
            >
              <div className="mb-3 h-3 w-28 animate-pulse rounded bg-muted/50" />
              <div className="mb-2 h-9 w-20 animate-pulse rounded bg-muted/40" />
              <div className="h-3 w-36 animate-pulse rounded bg-muted/30" />
            </div>
          ))}
        </div>
      ) : (
        <QuickStats stats={stats} />
      )}
      <AlertBanner members={members} />

      <div className="flex flex-wrap gap-4 items-center">
        <Tabs value={poleFilter} onValueChange={(v) => setPoleFilter(v as Pole | "all")}>
          <TabsList>
            <TabsTrigger value="all">Tous pôles</TabsTrigger>
            {poles.map((p) => (
              <TabsTrigger key={p} value={p}>
                {p}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Tabs value={loadFilter} onValueChange={(v) => setLoadFilter(v as LoadLevel | "all")}>
          <TabsList>
            <TabsTrigger value="all">Toutes charges</TabsTrigger>
            <TabsTrigger value="normale">Normale</TabsTrigger>
            <TabsTrigger value="moderee">Modérée</TabsTrigger>
            <TabsTrigger value="elevee">Élevée</TabsTrigger>
            <TabsTrigger value="critique">Critique</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-10">
        {(poleFilter === "all" ? poles : [poleFilter]).map((pole) => (
          <PoleSection
            key={pole}
            pole={pole}
            members={filtered.filter((m) => m.pole === pole)}
          />
        ))}
      </div>
    </div>
  );
}

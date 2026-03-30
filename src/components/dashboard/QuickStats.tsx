"use client";

import { Activity, AlertTriangle, FolderKanban, Network, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/types";

function teamAverageLoad(stats: DashboardStats): number {
  if (stats.totalMembers === 0) return 0;
  const sum = stats.poleStats.reduce((acc, p) => acc + p.avgLoad * p.memberCount, 0);
  return Math.round((sum / stats.totalMembers) * 10) / 10;
}

function overloadClasses(pct: number) {
  if (pct >= 35) {
    return {
      border: "border-l-[var(--kpi-overload-alert)]",
      iconBg: "bg-[color-mix(in_srgb,var(--kpi-overload-alert)_18%,transparent)]",
      iconFg: "text-[var(--kpi-overload-alert)]",
      value: "text-[var(--kpi-overload-alert)]",
      hover: "hover:border-[color-mix(in_srgb,var(--kpi-overload-alert)_35%,transparent)] hover:shadow-[0_8px_32px_rgba(225,29,72,0.18)]",
    };
  }
  if (pct >= 15) {
    return {
      border: "border-l-[var(--kpi-overload-warn)]",
      iconBg: "bg-[color-mix(in_srgb,var(--kpi-overload-warn)_18%,transparent)]",
      iconFg: "text-[var(--kpi-overload-warn)]",
      value: "text-[var(--kpi-overload-warn)]",
      hover: "hover:border-[color-mix(in_srgb,var(--kpi-overload-warn)_32%,transparent)] hover:shadow-[0_8px_32px_rgba(245,158,11,0.15)]",
    };
  }
  return {
    border: "border-l-[var(--kpi-overload-safe)]",
    iconBg: "bg-[color-mix(in_srgb,var(--kpi-overload-safe)_16%,transparent)]",
    iconFg: "text-[var(--kpi-overload-safe)]",
    value: "text-[var(--kpi-overload-safe)]",
    hover: "hover:border-[color-mix(in_srgb,var(--kpi-overload-safe)_28%,transparent)] hover:shadow-[0_8px_28px_rgba(16,185,129,0.12)]",
  };
}

/** Cartes indicateurs : couleur et hiérarchie typographique selon le sens du libellé. */
export function QuickStats({ stats }: { stats: DashboardStats }) {
  const overload = overloadClasses(stats.overloadPercentage);
  const avgLoad = teamAverageLoad(stats);
  const avgDisplay = Number.isInteger(avgLoad) ? `${avgLoad}` : avgLoad.toFixed(1);

  const rows = [
    {
      key: "members",
      title: "Membres",
      value: String(stats.totalMembers),
      sub: `${stats.membersInOverload} en surcharge forte`,
      Icon: Users,
      border: "border-l-[var(--kpi-members)]",
      iconBg: "bg-[var(--kpi-members-soft)]",
      iconFg: "text-[var(--kpi-members)]",
      titleTone: "text-[color-mix(in_srgb,var(--kpi-members)_65%,var(--foreground))]",
      valueClass: "text-foreground",
      hover:
        "hover:border-[color-mix(in_srgb,var(--kpi-members)_32%,var(--lumis-border)))] hover:shadow-[0_8px_32px_var(--kpi-members-glow)]",
    },
    {
      key: "projects",
      title: "Projets actifs",
      value: String(stats.activeProjects),
      sub: `${stats.totalProjects} au total dans le portefeuille`,
      Icon: FolderKanban,
      border: "border-l-[var(--kpi-projects)]",
      iconBg: "bg-[var(--kpi-projects-soft)]",
      iconFg: "text-[var(--kpi-projects)]",
      titleTone: "text-[color-mix(in_srgb,var(--kpi-projects)_62%,var(--foreground))]",
      valueClass: "text-foreground",
      hover:
        "hover:border-[color-mix(in_srgb,var(--kpi-projects)_30%,var(--lumis-border)))] hover:shadow-[0_8px_32px_var(--kpi-projects-glow)]",
    },
    {
      key: "overload",
      title: "Surcharge",
      value: `${stats.overloadPercentage}%`,
      sub: "part des membres en critique / élevée",
      Icon: AlertTriangle,
      border: overload.border,
      iconBg: overload.iconBg,
      iconFg: overload.iconFg,
      titleTone: "text-[var(--lumis-text-dim)]",
      valueClass: overload.value,
      hover: overload.hover,
    },
    {
      key: "avgload",
      title: "Charge moyenne",
      value: `${avgDisplay}%`,
      sub: "moyenne pondérée sur l’équipe",
      Icon: Activity,
      border: "border-l-[var(--kpi-activity)]",
      iconBg: "bg-[var(--kpi-activity-soft)]",
      iconFg: "text-[var(--kpi-activity)]",
      titleTone: "text-[color-mix(in_srgb,var(--kpi-activity)_58%,var(--foreground))]",
      valueClass: "text-foreground",
      hover:
        "hover:border-[color-mix(in_srgb,var(--kpi-activity)_28%,var(--lumis-border)))] hover:shadow-[0_8px_32px_var(--kpi-activity-glow)]",
    },
  ];

  if (stats.spofCount > 0) {
    rows.push({
      key: "spof",
      title: "SPOF détectés",
      value: String(stats.spofCount),
      sub: `${stats.criticalSpofCount} critique${stats.criticalSpofCount > 1 ? "s" : ""} — membres isolés sur plusieurs projets`,
      Icon: Network,
      border: stats.criticalSpofCount > 0 ? "border-l-[var(--kpi-overload-alert)]" : "border-l-[var(--kpi-overload-warn)]",
      iconBg: stats.criticalSpofCount > 0 ? "bg-[color-mix(in_srgb,var(--kpi-overload-alert)_18%,transparent)]" : "bg-[color-mix(in_srgb,var(--kpi-overload-warn)_18%,transparent)]",
      iconFg: stats.criticalSpofCount > 0 ? "text-[var(--kpi-overload-alert)]" : "text-[var(--kpi-overload-warn)]",
      titleTone: "text-[var(--lumis-text-dim)]",
      valueClass: stats.criticalSpofCount > 0 ? "text-[var(--kpi-overload-alert)]" : "text-[var(--kpi-overload-warn)]",
      hover: "hover:border-[color-mix(in_srgb,var(--kpi-overload-warn)_32%,transparent)] hover:shadow-[0_8px_32px_rgba(245,158,11,0.15)]",
    });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {rows.map((item) => (
        <Card
          key={item.key}
          className={cn(
            "relative overflow-hidden rounded-2xl border border-[var(--lumis-border)] border-l-[3px] transition-all duration-300",
            item.border,
            "hover:-translate-y-1",
            item.hover,
            "dark:bg-[color-mix(in_srgb,var(--lumis-card-glass)_88%,transparent)]",
          )}
        >
          <CardContent className="p-4 pt-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-3">
                <p
                  className={cn(
                    "text-[10px] font-black uppercase leading-none tracking-[0.2em]",
                    item.titleTone,
                  )}
                >
                  {item.title}
                </p>
                <p
                  className={cn(
                    "font-mono text-3xl font-bold tracking-tight tabular-nums",
                    item.valueClass,
                  )}
                >
                  {item.value}
                </p>
                <p className="text-xs leading-snug text-[var(--lumis-text-dim)]">{item.sub}</p>
              </div>
              <div
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/[0.06] shadow-inner shadow-black/20",
                  item.iconBg,
                )}
              >
                <item.Icon className={cn("size-5", item.iconFg)} aria-hidden />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

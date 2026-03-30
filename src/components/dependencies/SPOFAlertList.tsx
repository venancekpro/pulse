"use client";
import { AlertTriangle } from "lucide-react";
import type { SPOFAlert } from "@/types";

const RISK_COLORS = { medium: "#F59E0B", high: "#F97316", critical: "#DC2626" };
const RISK_LABELS = { medium: "Moyen", high: "Élevé", critical: "Critique" };

interface SPOFAlertListProps {
  alerts: SPOFAlert[];
}

export function SPOFAlertList({ alerts }: SPOFAlertListProps) {
  if (alerts.length === 0) {
    return <div className="text-center py-4 text-muted-foreground"><p className="text-sm">Aucun point de défaillance unique détecté</p></div>;
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div key={alert.memberId} className="rounded-lg border p-4" style={{ borderColor: `${RISK_COLORS[alert.riskLevel]}40` }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" style={{ color: RISK_COLORS[alert.riskLevel] }} />
              <span className="font-medium">{alert.memberName}</span>
              <span className="rounded px-1.5 py-0.5 text-xs font-medium" style={{ backgroundColor: `${RISK_COLORS[alert.riskLevel]}15`, color: RISK_COLORS[alert.riskLevel] }}>
                Risque {RISK_LABELS[alert.riskLevel]}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">Charge: {alert.currentLoad}%</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{alert.impactMessage}</p>
          <div className="mt-3 space-y-1">
            {alert.soloProjects.map((p) => (
              <div key={p.projectId} className="flex items-center gap-2 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                <span>{p.projectName}</span>
                <span className="text-muted-foreground">({p.projectCode})</span>
                <span className="text-xs text-muted-foreground">— {p.role}, {p.allocation}%</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

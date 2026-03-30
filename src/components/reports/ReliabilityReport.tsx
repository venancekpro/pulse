"use client";

import { useEffect, useState } from "react";
import { POLE_LABELS } from "@/lib/constants";
import type { ReliabilityScore } from "@/types";

const BIAS_COLORS = {
  optimiste: "#F59E0B",
  realiste: "#10B981",
  pessimiste: "#3B82F6",
};

const BIAS_LABELS = {
  optimiste: "Optimiste (sous-estime)",
  realiste: "Réaliste",
  pessimiste: "Pessimiste (surestime)",
};

export function ReliabilityReport() {
  const [memberScores, setMemberScores] = useState<ReliabilityScore[]>([]);
  const [poleScores, setPoleScores] = useState<ReliabilityScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports/reliability")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setMemberScores(json.data.memberScores);
          setPoleScores(json.data.poleScores);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-sm text-muted-foreground">Chargement...</div>;

  return (
    <div className="space-y-6">
      {/* Pole scores */}
      <div>
        <h3 className="text-sm font-medium mb-3">Par pôle</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {poleScores.map((s) => (
            <div key={s.pole} className="rounded-lg border p-3">
              <div className="text-sm font-medium">{POLE_LABELS[s.pole!] || s.pole}</div>
              <div className="mt-1 text-2xl font-bold" style={{ color: BIAS_COLORS[s.bias] }}>
                ×{s.correctionFactor}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {BIAS_LABELS[s.bias]} — {s.completedModules} modules
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Member scores */}
      <div>
        <h3 className="text-sm font-medium mb-3">Par membre</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-3 py-2 text-left font-medium">Membre</th>
                <th className="px-3 py-2 text-left font-medium">Pôle</th>
                <th className="px-3 py-2 text-center font-medium">Modules</th>
                <th className="px-3 py-2 text-center font-medium">Estimé (j)</th>
                <th className="px-3 py-2 text-center font-medium">Réel (j)</th>
                <th className="px-3 py-2 text-center font-medium">Ratio</th>
                <th className="px-3 py-2 text-left font-medium">Tendance</th>
                <th className="px-3 py-2 text-center font-medium">Confiance</th>
              </tr>
            </thead>
            <tbody>
              {memberScores.map((s) => (
                <tr key={s.memberId} className="border-b">
                  <td className="px-3 py-2 font-medium">{s.memberName}</td>
                  <td className="px-3 py-2 text-muted-foreground">{POLE_LABELS[s.pole!] || s.pole}</td>
                  <td className="px-3 py-2 text-center">{s.completedModules}/{s.totalModules}</td>
                  <td className="px-3 py-2 text-center">{s.totalEstimatedDays}</td>
                  <td className="px-3 py-2 text-center">{s.totalActualDays}</td>
                  <td className="px-3 py-2 text-center font-mono" style={{ color: BIAS_COLORS[s.bias] }}>
                    ×{s.ratio}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs"
                      style={{ backgroundColor: `${BIAS_COLORS[s.bias]}15`, color: BIAS_COLORS[s.bias] }}
                    >
                      {s.bias === "optimiste" ? "↑" : s.bias === "pessimiste" ? "↓" : "≈"} {s.bias}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center text-xs text-muted-foreground">{s.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

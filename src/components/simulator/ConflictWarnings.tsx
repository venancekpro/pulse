"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Warning } from "@/types";

export function ConflictWarnings({ warnings }: { warnings: Warning[] }) {
  if (warnings.length === 0) return null;
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Alertes</h3>
      {warnings.map((w, i) => (
        <Alert
          key={i}
          variant={w.severity === "critical" ? "destructive" : "default"}
          className="text-sm"
        >
          <AlertTitle className="capitalize">{w.type.replace("_", " ")}</AlertTitle>
          <AlertDescription>{w.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}

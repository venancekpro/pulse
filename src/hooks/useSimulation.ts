"use client";

import { useCallback, useState } from "react";
import { useSimulationStore } from "@/stores/simulation-store";
import type { SimulationAssignment, SimulationProjectData, SimulationResult } from "@/types";

export function useSimulation() {
  const { lastResult, setLastResult } = useSimulationStore();
  const [loading, setLoading] = useState(false);

  const run = useCallback(
    async (projectData: SimulationProjectData, assignments: SimulationAssignment[]) => {
      setLoading(true);
      try {
        const res = await fetch("/api/simulation/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectData, assignments }),
        });
        const json = (await res.json()) as { success: boolean; data?: SimulationResult; error?: string };
        if (!res.ok) throw new Error(json.error ?? "Erreur simulation");
        if (json.data) setLastResult(json.data);
        return json.data ?? null;
      } finally {
        setLoading(false);
      }
    },
    [setLastResult],
  );

  return { run, loading, lastResult, setLastResult };
}

"use client";

import { useCallback, useState } from "react";
import { useSimulationStore } from "@/stores/simulation-store";
import type { SimulationAssignment, SimulationProjectData, SimulationResult } from "@/types";

export function useSimulation() {
  const store = useSimulationStore();
  const [loading, setLoading] = useState(false);

  const activeScenario = store.scenarios.find(
    (s) => s.id === store.activeScenarioId,
  );
  const lastResult = activeScenario?.result ?? null;

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
        if (json.data && store.activeScenarioId) {
          store.setScenarioResult(store.activeScenarioId, json.data);
        }
        return json.data ?? null;
      } finally {
        setLoading(false);
      }
    },
    [store],
  );

  const setLastResult = useCallback(
    (r: SimulationResult | null) => {
      if (store.activeScenarioId && r) {
        store.setScenarioResult(store.activeScenarioId, r);
      }
    },
    [store],
  );

  return { run, loading, lastResult, setLastResult };
}

"use client";

import { useCallback, useState } from "react";
import { useSimulationStore } from "@/stores/simulation-store";
import type { SimulationAssignment, SimulationResult } from "@/types";

export function useScenarioActions() {
  const store = useSimulationStore();
  const [loading, setLoading] = useState(false);

  const runScenario = useCallback(
    async (scenarioId: string, members: { id: string; name: string }[]) => {
      const scenario = store.scenarios.find((s) => s.id === scenarioId);
      if (!scenario) return null;

      const { formData } = scenario;
      const validModules = formData.modules.filter(
        (m) => m.name.trim() && m.estimatedDays > 0,
      );

      const assignments: SimulationAssignment[] = Object.entries(formData.allocations)
        .filter(([, v]) => v > 0)
        .map(([memberId, allocation]) => {
          const m = members.find((x) => x.id === memberId);
          return {
            memberId,
            memberName: m?.name ?? memberId,
            allocation,
            role: formData.roles[memberId] ?? "contributeur",
          };
        });

      setLoading(true);
      try {
        const res = await fetch("/api/simulation/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectData: {
              name: formData.name,
              code: formData.code,
              deadline: formData.deadline,
              complexity: formData.complexity,
              modules: validModules.map((m) => ({
                name: m.name,
                estimatedDays: m.estimatedDays,
              })),
            },
            assignments,
          }),
        });
        const json = (await res.json()) as {
          success: boolean;
          data?: SimulationResult;
          error?: string;
        };
        if (!res.ok) throw new Error(json.error ?? "Erreur simulation");
        if (json.data) {
          store.setScenarioResult(scenarioId, json.data);
        }
        return json.data ?? null;
      } finally {
        setLoading(false);
      }
    },
    [store],
  );

  const saveScenario = useCallback(
    async (scenarioId: string) => {
      const scenario = store.scenarios.find((s) => s.id === scenarioId);
      if (!scenario?.result) return;

      const res = await fetch("/api/simulation/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectData: scenario.formData,
          assignments: Object.entries(scenario.formData.allocations)
            .filter(([, v]) => v > 0)
            .map(([memberId, allocation]) => ({
              memberId,
              allocation,
              role: scenario.formData.roles[memberId] ?? "contributeur",
            })),
          results: scenario.result,
        }),
      });
      const json = (await res.json()) as { success: boolean; data?: { id: string } };
      if (!res.ok) throw new Error("Erreur sauvegarde");
      return json.data;
    },
    [store],
  );

  return {
    runScenario,
    saveScenario,
    loading,
    ...store,
  };
}

"use client";

import { Plus, X, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSimulationStore } from "@/stores/simulation-store";

export function ScenarioTabs() {
  const scenarios = useSimulationStore((s) => s.scenarios);
  const activeId = useSimulationStore((s) => s.activeScenarioId);
  const compareMode = useSimulationStore((s) => s.compareMode);
  const setActive = useSimulationStore((s) => s.setActiveScenario);
  const add = useSimulationStore((s) => s.addScenario);
  const remove = useSimulationStore((s) => s.removeScenario);
  const toggleCompare = useSimulationStore((s) => s.toggleCompareMode);

  return (
    <div className="flex items-center justify-between gap-4">
      <Tabs
        value={activeId ?? undefined}
        onValueChange={(v) => v && setActive(v as string)}
      >
        <TabsList className="overflow-x-auto">
          {scenarios.map((s) => (
            <TabsTrigger key={s.id} value={s.id} className="gap-1.5">
              <span className="truncate max-w-[120px]">{s.label}</span>
              {s.result && (
                <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
              )}
              {scenarios.length > 1 && (
                <span
                  role="button"
                  tabIndex={0}
                  className="ml-1 rounded-full p-0.5 hover:bg-destructive/20 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    remove(s.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      e.preventDefault();
                      remove(s.id);
                    }
                  }}
                >
                  <X className="size-3 text-muted-foreground hover:text-destructive" />
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => add(`Scénario ${scenarios.length + 1}`)}
        >
          <Plus className="size-3.5 mr-1.5" />
          Nouveau
        </Button>
        {scenarios.length >= 2 && (
          <Button
            variant={compareMode ? "default" : "outline"}
            size="sm"
            onClick={toggleCompare}
          >
            <GitCompare className="size-3.5 mr-1.5" />
            Comparer
          </Button>
        )}
      </div>
    </div>
  );
}

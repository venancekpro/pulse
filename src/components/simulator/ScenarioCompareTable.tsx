"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LOAD_COLORS } from "@/lib/constants";
import { loadLevelFromPercent } from "@/lib/utils/load-calculator";
import { useSimulationStore } from "@/stores/simulation-store";

export function ScenarioCompareTable() {
  const scenarios = useSimulationStore((s) => s.scenarios);

  // Collect all unique member IDs across all scenario results
  const memberMap = new Map<string, { id: string; name: string }>();
  for (const s of scenarios) {
    if (!s.result) continue;
    for (const state of s.result.afterState) {
      if (!memberMap.has(state.memberId)) {
        memberMap.set(state.memberId, { id: state.memberId, name: state.memberName });
      }
    }
  }
  const members = Array.from(memberMap.values());

  if (members.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        Lancez au moins une simulation pour comparer.
      </p>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Comparaison des scénarios</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-40">Membre</TableHead>
            {scenarios.map((s) => (
              <TableHead key={s.id} className="text-center">
                {s.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((m) => (
            <TableRow key={m.id}>
              <TableCell className="font-medium text-sm">{m.name}</TableCell>
              {scenarios.map((s) => {
                if (!s.result) {
                  return (
                    <TableCell key={s.id} className="text-center text-muted-foreground text-xs">
                      Non simulé
                    </TableCell>
                  );
                }
                const before = s.result.beforeState.find((x) => x.memberId === m.id);
                const after = s.result.afterState.find((x) => x.memberId === m.id);
                if (!before || !after) {
                  return (
                    <TableCell key={s.id} className="text-center text-muted-foreground text-xs">
                      —
                    </TableCell>
                  );
                }
                const level = loadLevelFromPercent(after.currentLoad);
                const color = LOAD_COLORS[level];
                return (
                  <TableCell key={s.id} className="text-center">
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {before.currentLoad}%
                    </span>
                    <span className="text-muted-foreground mx-1">→</span>
                    <span
                      className="text-sm font-semibold tabular-nums"
                      style={{ color }}
                    >
                      {after.currentLoad}%
                    </span>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

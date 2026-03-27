"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSimulation } from "@/hooks/useSimulation";
import { BeforeAfterComparison } from "@/components/simulator/BeforeAfterComparison";
import { ConflictWarnings } from "@/components/simulator/ConflictWarnings";
import { ImpactPreview } from "@/components/simulator/ImpactPreview";
import { MemberImpactCard } from "@/components/simulator/MemberImpactCard";
import { RecommendationPanel } from "@/components/simulator/RecommendationPanel";
import type { MemberWithLoad, SimulationAssignment } from "@/types";

export function SimulatorForm({ members }: { members: MemberWithLoad[] }) {
  const { run, loading, lastResult } = useSimulation();
  const [name, setName] = useState("Nouveau module");
  const [code, setCode] = useState("NEW");
  const [deadline, setDeadline] = useState("");
  const [complexity, setComplexity] = useState<"faible" | "moyenne" | "haute" | "critique">("moyenne");
  const [allocations, setAllocations] = useState<Record<string, string>>({});

  const assignmentPayload: SimulationAssignment[] = useMemo(() => {
    return Object.entries(allocations)
      .filter(([, v]) => v && Number(v) > 0)
      .map(([memberId, v]) => {
        const m = members.find((x) => x.id === memberId);
        return {
          memberId,
          memberName: m?.name ?? memberId,
          allocation: Number(v),
          role: "contributeur" as const,
        };
      });
  }, [allocations, members]);

  async function submit() {
    if (!deadline) {
      toast.error("Indiquez une échéance");
      return;
    }
    if (assignmentPayload.length === 0) {
      toast.error("Attribuez au moins un membre avec un %");
      return;
    }
    try {
      await run(
        {
          name,
          code,
          deadline,
          complexity,
          modules: [{ name: "MVP", estimatedDays: 10 }],
        },
        assignmentPayload.map((a) => ({
          ...a,
          role: "contributeur",
        })),
      );
      toast.success("Simulation calculée");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 max-w-3xl">
        <div className="space-y-2">
          <Label>Nom projet fictif</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Code</Label>
          <Input value={code} onChange={(e) => setCode(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Échéance</Label>
          <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Complexité</Label>
          <Select
            value={complexity}
            onValueChange={(v) =>
              v && setComplexity(v as "faible" | "moyenne" | "haute" | "critique")
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="faible">Faible</SelectItem>
              <SelectItem value="moyenne">Moyenne</SelectItem>
              <SelectItem value="haute">Haute</SelectItem>
              <SelectItem value="critique">Critique</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Affectations proposées (%)</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-2">
              <Label className="w-28 truncate text-xs">{m.name}</Label>
              <Input
                type="number"
                min={0}
                max={100}
                className="h-8"
                value={allocations[m.id] ?? ""}
                onChange={(e) =>
                  setAllocations((prev) => ({ ...prev, [m.id]: e.target.value }))
                }
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>

      <Button onClick={() => void submit()} loading={loading}>
        {loading ? "Calcul…" : "Lancer la simulation"}
      </Button>

      {lastResult && (
        <div className="space-y-6 border-t pt-6">
          <ImpactPreview summary={lastResult.summary} />
          <BeforeAfterComparison before={lastResult.beforeState} after={lastResult.afterState} />
          <div>
            <h3 className="text-sm font-semibold mb-2">Impacts individuels</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {lastResult.impacts.map((imp) => (
                <MemberImpactCard key={imp.memberId} impact={imp} />
              ))}
            </div>
          </div>
          <RecommendationPanel items={lastResult.recommendations} />
          <ConflictWarnings warnings={lastResult.warnings} />
        </div>
      )}
    </div>
  );
}

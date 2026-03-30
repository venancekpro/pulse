"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarDays } from "lucide-react";
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
import { useSimulationStore } from "@/stores/simulation-store";
import { useScenarioActions } from "@/hooks/useScenarioActions";
import { BeforeAfterComparison } from "@/components/simulator/BeforeAfterComparison";
import { ConflictWarnings } from "@/components/simulator/ConflictWarnings";
import { ImpactPreview } from "@/components/simulator/ImpactPreview";
import { MemberImpactCard } from "@/components/simulator/MemberImpactCard";
import { RecommendationPanel } from "@/components/simulator/RecommendationPanel";
import { MemberAllocationRow } from "@/components/simulator/MemberAllocationRow";
import { ModuleEditor } from "@/components/simulator/ModuleEditor";
import type { MemberWithLoad, AssignmentRole, ProjectComplexity, SimulatorModule } from "@/types";

export function SimulatorForm({ members }: { members: MemberWithLoad[] }) {
  const router = useRouter();
  const activeId = useSimulationStore((s) => s.activeScenarioId);
  const scenario = useSimulationStore((s) =>
    s.scenarios.find((sc) => sc.id === s.activeScenarioId),
  );
  const updateForm = useSimulationStore((s) => s.updateScenarioForm);
  const setPhantomProject = useSimulationStore((s) => s.setPhantomProject);
  const { runScenario, saveScenario, loading } = useScenarioActions();

  const formData = scenario?.formData;
  const result = scenario?.result ?? null;

  const update = useCallback(
    (patch: Record<string, unknown>) => {
      if (activeId) updateForm(activeId, patch as Record<string, never>);
    },
    [activeId, updateForm],
  );

  const assignedCount = useMemo(() => {
    if (!formData) return 0;
    return Object.values(formData.allocations).filter((v) => v > 0).length;
  }, [formData]);

  async function submit() {
    if (!formData || !activeId) return;
    if (!formData.deadline) {
      toast.error("Indiquez une échéance");
      return;
    }
    if (assignedCount === 0) {
      toast.error("Attribuez au moins un membre avec un %");
      return;
    }
    const validModules = formData.modules.filter(
      (m) => m.name.trim() && m.estimatedDays > 0,
    );
    if (validModules.length === 0) {
      toast.error("Ajoutez au moins un module avec un nom et une durée");
      return;
    }
    try {
      await runScenario(activeId, members.map((m) => ({ id: m.id, name: m.name })));
      toast.success("Simulation calculée");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    }
  }

  async function handleSave() {
    if (!activeId || !result) return;
    try {
      await saveScenario(activeId);
      toast.success("Scénario sauvegardé");
    } catch {
      toast.error("Erreur de sauvegarde");
    }
  }

  if (!formData || !activeId) {
    return <p className="text-muted-foreground">Aucun scénario actif</p>;
  }

  return (
    <div className="space-y-8">
      {/* Infos projet */}
      <div className="grid gap-4 md:grid-cols-2 max-w-3xl">
        <div className="space-y-2">
          <Label>Nom projet fictif</Label>
          <Input
            value={formData.name}
            onChange={(e) => update({ name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Code</Label>
          <Input
            value={formData.code}
            onChange={(e) => update({ code: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Échéance</Label>
          <Input
            type="date"
            value={formData.deadline}
            onChange={(e) => update({ deadline: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Complexité</Label>
          <Select
            value={formData.complexity}
            onValueChange={(v) => v && update({ complexity: v as ProjectComplexity })}
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

      {/* Modules du projet */}
      <ModuleEditor
        modules={formData.modules}
        onChange={(modules: SimulatorModule[]) => update({ modules })}
      />

      {/* Affectations avec sliders + preview live */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Affectations proposées</h3>
        <div className="rounded-lg border border-border p-3">
          <div className="flex items-center gap-3 pb-2 mb-2 border-b border-border text-xs text-muted-foreground font-medium">
            <span className="w-28 shrink-0">Membre</span>
            <span className="w-[110px] shrink-0">Rôle</span>
            <span className="flex-1 min-w-[100px] text-center">Allocation</span>
            <span className="w-16 text-center">%</span>
            <span className="w-52 shrink-0 text-right">Charge projetée</span>
          </div>
          {members.map((m) => (
            <MemberAllocationRow
              key={m.id}
              member={m}
              allocation={formData.allocations[m.id] ?? 0}
              role={(formData.roles[m.id] as AssignmentRole) ?? "contributeur"}
              onAllocationChange={(v) =>
                update({ allocations: { ...formData.allocations, [m.id]: v } })
              }
              onRoleChange={(r) =>
                update({ roles: { ...formData.roles, [m.id]: r } })
              }
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={() => void submit()} loading={loading}>
          {loading ? "Calcul…" : "Lancer la simulation"}
        </Button>
        {result && (
          <>
            <Button variant="outline" onClick={() => void handleSave()}>
              Sauvegarder
            </Button>
            {formData.deadline && (
              <Button
                variant="outline"
                onClick={() => {
                  const validModules = formData.modules.filter(
                    (m) => m.name.trim() && m.estimatedDays > 0,
                  );
                  const assignments = Object.entries(formData.allocations)
                    .filter(([, v]) => v > 0)
                    .map(([memberId, allocation]) => {
                      const member = members.find((x) => x.id === memberId);
                      return {
                        memberId,
                        memberName: member?.name ?? memberId,
                        allocation,
                        role: (formData.roles[memberId] ?? "contributeur") as "lead" | "contributeur",
                      };
                    });
                  setPhantomProject({
                    scenarioId: activeId!,
                    scenarioLabel: scenario!.label,
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
                    startDate: new Date().toISOString().slice(0, 10),
                  });
                  router.push("/timeline");
                }}
              >
                <CalendarDays className="size-4 mr-1.5" />
                Voir sur la timeline
              </Button>
            )}
          </>
        )}
      </div>

      {result && (
        <div className="space-y-6 border-t pt-6">
          <ImpactPreview summary={result.summary} />
          <BeforeAfterComparison before={result.beforeState} after={result.afterState} />
          <div>
            <h3 className="text-sm font-semibold mb-2">Impacts individuels</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {result.impacts.map((imp) => (
                <MemberImpactCard key={imp.memberId} impact={imp} />
              ))}
            </div>
          </div>
          <RecommendationPanel items={result.recommendations} />
          <ConflictWarnings warnings={result.warnings} />
        </div>
      )}
    </div>
  );
}

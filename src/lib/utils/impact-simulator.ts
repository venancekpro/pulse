import { differenceInDays, parseISO } from "date-fns";
import { memberBasics } from "@/lib/utils/load-calculator";
import type {
  MemberImpact,
  MemberLoadState,
  Recommendation,
  SimulationAssignment,
  SimulationProjectData,
  SimulationResult,
  SimulationSummary,
  Warning,
} from "@/types";
import type { Pole as PrismaPole } from "@/generated/prisma/client";

type MemberRow = {
  id: string;
  name: string;
  pole: PrismaPole;
  roles: string;
  transversalRoles: string;
  loadLevel: string;
  assignments: Array<{
    allocation: number;
    role: string;
    isUrgent: boolean;
    project: { status: string; name: string; deadline: Date };
  }>;
};

function toState(m: ReturnType<typeof memberBasics>): MemberLoadState {
  return {
    memberId: m.id,
    memberName: m.name,
    pole: m.pole,
    currentLoad: m.calculatedLoad,
    loadLevel: m.loadLevel,
    projectCount: m.projectCount,
  };
}

export function runImpactSimulation(
  members: MemberRow[],
  projectData: SimulationProjectData,
  extraAssignments: SimulationAssignment[],
): SimulationResult {
  const beforeState: MemberLoadState[] = [];
  const afterAssignments = new Map<string, typeof members[0]["assignments"]>();

  for (const m of members) {
    beforeState.push(toState(memberBasics(m)));
    afterAssignments.set(
      m.id,
      m.assignments.map((a) => ({ ...a, project: { ...a.project } })),
    );
  }

  const newDeadline = parseISO(projectData.deadline);

  for (const sa of extraAssignments) {
    const list = afterAssignments.get(sa.memberId);
    if (!list) continue;
    list.push({
      allocation: sa.allocation,
      role: sa.role,
      isUrgent: projectData.complexity === "critique" || projectData.complexity === "haute",
      project: {
        status: "actif",
        name: projectData.name,
        deadline: newDeadline,
      },
    });
  }

  const afterState: MemberLoadState[] = [];
  const impacts: MemberImpact[] = [];
  const warnings: Warning[] = [];

  for (const m of members) {
    const copy = {
      ...m,
      assignments: afterAssignments.get(m.id)!,
    };
    const after = memberBasics(copy);
    afterState.push(toState(after));

    const before = memberBasics(m);
    const increase = Math.round((after.calculatedLoad - before.calculatedLoad) * 10) / 10;
    if (increase <= 0) continue;

    let rec: MemberImpact["recommendation"] = "ok";
    if (after.loadLevel === "critique" || after.calculatedLoad > 100) rec = "critical";
    else if (after.loadLevel === "elevee" || after.calculatedLoad > 80) rec = "warning";

    const conflictingDeadlines: { projectName: string; deadline: Date }[] = [];
    for (const a of m.assignments) {
      if (a.project.status === "livre") continue;
      const d = new Date(a.project.deadline);
      if (Math.abs(differenceInDays(d, newDeadline)) <= 14) {
        conflictingDeadlines.push({ projectName: a.project.name, deadline: d });
      }
    }

    impacts.push({
      memberId: m.id,
      memberName: m.name,
      pole: before.pole,
      currentLoad: before.calculatedLoad,
      projectedLoad: after.calculatedLoad,
      currentLevel: before.loadLevel,
      projectedLevel: after.loadLevel,
      loadIncrease: increase,
      recommendation: rec,
      conflictingDeadlines,
    });

    if (conflictingDeadlines.length > 0) {
      warnings.push({
        type: "deadline_conflict",
        severity: rec === "critical" ? "high" : "medium",
        message: `${m.name}: conflits de délais proches avec le nouveau projet`,
        affectedMembers: [m.name],
      });
    }
    if (after.loadLevel === "critique") {
      warnings.push({
        type: "overload",
        severity: "critical",
        message: `${m.name} passerait en charge critique (${after.calculatedLoad}%)`,
        affectedMembers: [m.name],
      });
    }
  }

  const recommendations: Recommendation[] = [];
  for (const imp of impacts) {
    if (imp.recommendation === "critical") {
      recommendations.push({
        type: "reduce_allocation",
        memberId: imp.memberId,
        memberName: imp.memberName,
        reason: "Réduire l'allocation ou reporter le projet pour éviter la surcharge",
        suggestedAllocation: Math.max(5, Math.floor(imp.projectedLoad - 85)),
      });
    }
  }

  const membersAffected = impacts.length;
  const entering = impacts.filter(
    (i) => i.currentLevel !== "critique" && i.projectedLevel === "critique",
  ).length;
  const avgInc =
    impacts.length > 0
      ? Math.round((impacts.reduce((s, i) => s + i.loadIncrease, 0) / impacts.length) * 10) / 10
      : 0;

  let riskLevel: SimulationSummary["riskLevel"] = "low";
  if (entering >= 2 || impacts.some((i) => i.recommendation === "critical")) riskLevel = "critical";
  else if (entering === 1 || impacts.some((i) => i.recommendation === "warning")) riskLevel = "high";
  else if (impacts.length > 0) riskLevel = "medium";

  const summary: SimulationSummary = {
    totalMembersAffected: membersAffected,
    membersEnteringOverload: entering,
    averageLoadIncrease: avgInc,
    riskLevel,
    canProceed: riskLevel !== "critical",
  };

  return { beforeState, afterState, impacts, recommendations, warnings, summary };
}

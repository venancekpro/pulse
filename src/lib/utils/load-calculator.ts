import { LOAD_THRESHOLDS, ROLE_WEIGHT, TRANSVERSAL_COST } from "@/lib/constants";
import { poleFromDb, projectStatusFromDb } from "@/lib/mappers";
import type { AssignmentRole, LoadLevel, Pole } from "@/types";

export function loadLevelFromPercent(p: number): LoadLevel {
  const n = Math.round(p);
  if (n <= LOAD_THRESHOLDS.normale.max) return "normale";
  if (n <= LOAD_THRESHOLDS.moderee.max) return "moderee";
  if (n <= LOAD_THRESHOLDS.elevee.max) return "elevee";
  return "critique";
}

type AssignmentInput = {
  allocation: number;
  role: string;
  isUrgent?: boolean;
  project?: { status: string; name?: string; deadline?: Date } | null;
};

export function calculateAssignmentsLoad(assignments: AssignmentInput[]): number {
  let load = 0;
  for (const a of assignments) {
    const st = a.project ? projectStatusFromDb(a.project.status) : "actif";
    if (st === "livre") continue;
    const role = (a.role === "lead" ? "lead" : "contributeur") as AssignmentRole;
    const w = ROLE_WEIGHT[role];
    load += a.allocation * w;
  }
  return Math.round(load * 10) / 10;
}

export function transversalLoad(transversalRoles: string[]): number {
  let extra = 0;
  for (const r of transversalRoles) {
    extra += TRANSVERSAL_COST[r] ?? 0;
  }
  return extra;
}

export function calculateMemberLoad(input: {
  assignments: AssignmentInput[];
  transversalRoles: string[];
}): number {
  return Math.min(
    Math.round((calculateAssignmentsLoad(input.assignments) + transversalLoad(input.transversalRoles)) * 10) / 10,
    200,
  );
}

export function memberBasics(m: {
  id: string;
  name: string;
  pole: string;
  roles: string;
  transversalRoles: string;
  loadLevel: string;
  assignments: AssignmentInput[];
}): {
  id: string;
  name: string;
  pole: Pole;
  calculatedLoad: number;
  loadLevel: LoadLevel;
  projectCount: number;
  urgentProjectCount: number;
} {
  let roles: string[];
  let tr: string[];
  try {
    roles = JSON.parse(m.roles) as string[];
  } catch {
    roles = [];
  }
  try {
    tr = JSON.parse(m.transversalRoles) as string[];
  } catch {
    tr = [];
  }
  const calculatedLoad = calculateMemberLoad({
    assignments: m.assignments,
    transversalRoles: tr,
  });
  const derivedLevel = loadLevelFromPercent(calculatedLoad);
  const urgentProjectCount = m.assignments.filter((a) => {
    const st = a.project ? projectStatusFromDb(a.project.status) : "actif";
    if (st === "livre") return false;
    return Boolean(a.isUrgent);
  }).length;

  return {
    id: m.id,
    name: m.name,
    pole: poleFromDb(m.pole as Parameters<typeof poleFromDb>[0]),
    calculatedLoad,
    loadLevel: derivedLevel,
    projectCount: m.assignments.filter((a) => {
      const st = a.project ? projectStatusFromDb(a.project.status) : "actif";
      return st !== "livre";
    }).length,
    urgentProjectCount,
  };
}

import { addDays, eachDayOfInterval, isWeekend } from "date-fns";
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

type LeaveInput = { startDate: Date | string; endDate: Date | string };

export function calculateEffectiveLoad(
  rawLoad: number,
  leaves: LeaveInput[],
  horizonDays: number = 10,
): { effectiveLoad: number; availabilityFraction: number; isOnLeave: boolean; currentLeave?: LeaveInput } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const horizonEnd = addDays(today, horizonDays);

  const allDays = eachDayOfInterval({ start: today, end: horizonEnd });
  const businessDays = allDays.filter((d) => !isWeekend(d));
  const totalBusinessDays = businessDays.length;

  if (totalBusinessDays === 0) {
    return { effectiveLoad: rawLoad, availabilityFraction: 1, isOnLeave: false };
  }

  let currentLeave: LeaveInput | undefined;
  const leaveDaysSet = new Set<string>();

  for (const leave of leaves) {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (start <= today && end >= today) {
      currentLeave = leave;
    }

    if (end < today || start > horizonEnd) continue;

    const overlapStart = start < today ? today : start;
    const overlapEnd = end > horizonEnd ? horizonEnd : end;
    const overlapDays = eachDayOfInterval({ start: overlapStart, end: overlapEnd });
    for (const d of overlapDays) {
      if (!isWeekend(d)) {
        leaveDaysSet.add(d.toISOString().slice(0, 10));
      }
    }
  }

  const leaveDaysCount = leaveDaysSet.size;
  const availableDays = totalBusinessDays - leaveDaysCount;
  const availabilityFraction = availableDays / totalBusinessDays;
  const isOnLeave = currentLeave !== undefined;

  if (availabilityFraction <= 0) {
    return { effectiveLoad: Math.min(200, rawLoad / 0.01), availabilityFraction: 0, isOnLeave, currentLeave };
  }

  const effectiveLoad = Math.min(200, Math.round((rawLoad / availabilityFraction) * 10) / 10);

  return { effectiveLoad, availabilityFraction, isOnLeave, currentLeave };
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
  let tr: string[];
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

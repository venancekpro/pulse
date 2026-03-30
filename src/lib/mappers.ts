import type { Pole as PrismaPole } from "@/generated/prisma/client";
import type {
  AssignmentRole,
  AvailabilityMargin,
  LeaveType,
  LoadLevel,
  ModuleStatus,
  ModuleType,
  Pole,
  ProjectComplexity,
  ProjectStatus,
} from "@/types";

export function poleFromDb(p: PrismaPole): Pole {
  return p === "ux_ui" ? "ux-ui" : (p as Pole);
}

export function poleToDb(p: Pole): PrismaPole {
  return p === "ux-ui" ? "ux_ui" : (p as PrismaPole);
}

export function projectStatusFromDb(s: string): ProjectStatus {
  if (s === "en_attente") return "en-attente";
  return s as ProjectStatus;
}

export function projectStatusToDb(s: ProjectStatus): "actif" | "livre" | "en_attente" | "urgent" {
  if (s === "en-attente") return "en_attente";
  return s as "actif" | "livre" | "urgent";
}

export function moduleStatusFromDb(s: string): ModuleStatus {
  if (s === "in_progress") return "in-progress";
  return s as ModuleStatus;
}

export function moduleStatusToDb(s: ModuleStatus): "todo" | "in_progress" | "review" | "done" {
  if (s === "in-progress") return "in_progress";
  return s as "todo" | "review" | "done";
}

export function moduleTypeFromDb(t: string): ModuleType {
  return t as ModuleType;
}

export function assignmentRoleFromDb(r: string): AssignmentRole {
  return r as AssignmentRole;
}

export function loadLevelFromDb(l: string): LoadLevel {
  return l as LoadLevel;
}

export function complexityFromDb(c: string): ProjectComplexity {
  return c as ProjectComplexity;
}

export function availabilityFromDb(s: string | null | undefined): AvailabilityMargin | undefined {
  if (!s) return undefined;
  return s as AvailabilityMargin;
}

export function leaveTypeFromDb(t: string): LeaveType {
  return t as LeaveType;
}

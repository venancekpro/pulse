import {
  assignmentRoleFromDb,
  availabilityFromDb,
  complexityFromDb,
  loadLevelFromDb,
  moduleStatusFromDb,
  moduleTypeFromDb,
  poleFromDb,
  projectStatusFromDb,
} from "@/lib/mappers";
import { leaveTypeFromDb } from "@/lib/mappers";
import { calculateEffectiveLoad, memberBasics } from "@/lib/utils/load-calculator";
import type { Assignment, Leave, Member, MemberSkill, MemberWithLoad, Module, Notification, NotificationType, Project } from "@/types";

export function toLeave(row: {
  id: string;
  memberId: string;
  startDate: Date;
  endDate: Date;
  type: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Leave {
  return {
    id: row.id,
    memberId: row.memberId,
    startDate: row.startDate,
    endDate: row.endDate,
    type: leaveTypeFromDb(row.type),
    description: row.description ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toMember(
  row: {
    id: string;
    name: string;
    pole: string;
    roles: string;
    skills?: string;
    loadLevel: string;
    transversalRoles: string;
    isoActionsCompleted: number | null;
    isoActionsTotal: number | null;
    availabilityMargin: string | null;
    createdAt: Date;
    updatedAt: Date;
    assignments: Array<{
      id: string;
      memberId: string;
      projectId: string;
      role: string;
      allocation: number;
      isUrgent: boolean;
      createdAt: Date;
      updatedAt: Date;
      project: {
        id: string;
        name: string;
        code: string;
        status: string;
        deadline: Date;
      };
    }>;
    leaves?: Array<{
      id: string;
      memberId: string;
      startDate: Date;
      endDate: Date;
      type: string;
      description: string | null;
      createdAt: Date;
      updatedAt: Date;
    }>;
  },
  withLoad = false,
): Member | MemberWithLoad {
  let roles: string[];
  let transversalRoles: string[];
  let skills: MemberSkill[];
  try {
    roles = JSON.parse(row.roles) as string[];
  } catch {
    roles = [];
  }
  try {
    transversalRoles = JSON.parse(row.transversalRoles) as string[];
  } catch {
    transversalRoles = [];
  }
  try {
    skills = JSON.parse(row.skills ?? "[]") as MemberSkill[];
  } catch {
    skills = [];
  }

  const assignments: Assignment[] = row.assignments.map((a) => ({
    id: a.id,
    memberId: a.memberId,
    projectId: a.projectId,
    role: assignmentRoleFromDb(a.role),
    allocation: a.allocation,
    isUrgent: a.isUrgent,
    project: {
      id: a.project.id,
      name: a.project.name,
      code: a.project.code,
      status: projectStatusFromDb(a.project.status),
      startDate: new Date(),
      deadline: a.project.deadline,
      complexity: "moyenne",
      modules: [],
      assignments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  }));

  const leaves: Leave[] = (row.leaves ?? []).map(toLeave);

  const base: Member = {
    id: row.id,
    name: row.name,
    pole: poleFromDb(row.pole as Parameters<typeof poleFromDb>[0]),
    roles,
    skills,
    loadLevel: loadLevelFromDb(row.loadLevel),
    transversalRoles,
    isoActions:
      row.isoActionsTotal != null && row.isoActionsCompleted != null
        ? { completed: row.isoActionsCompleted, total: row.isoActionsTotal }
        : undefined,
    availabilityMargin: availabilityFromDb(row.availabilityMargin),
    assignments,
    leaves,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };

  if (!withLoad) return base;

  const basics = memberBasics({
    id: row.id,
    name: row.name,
    pole: row.pole,
    roles: row.roles,
    transversalRoles: row.transversalRoles,
    loadLevel: row.loadLevel,
    assignments: row.assignments.map((a) => ({
      allocation: a.allocation,
      role: a.role,
      isUrgent: a.isUrgent,
      project: { status: a.project.status },
    })),
  });

  const { effectiveLoad, isOnLeave, currentLeave } = calculateEffectiveLoad(
    basics.calculatedLoad,
    leaves,
  );

  return {
    ...base,
    calculatedLoad: basics.calculatedLoad,
    effectiveLoad,
    projectCount: basics.projectCount,
    urgentProjectCount: basics.urgentProjectCount,
    isOnLeave,
    currentLeave: currentLeave ? toLeave(currentLeave as Parameters<typeof toLeave>[0]) : undefined,
  };
}

export function toProject(row: {
  id: string;
  name: string;
  code: string;
  description: string | null;
  status: string;
  startDate: Date;
  deadline: Date;
  complexity: string;
  createdAt: Date;
  updatedAt: Date;
  modules: Array<{
    id: string;
    name: string;
    type: string;
    estimatedDays: number;
    completedDays: number;
    status: string;
    projectId: string;
    assignedToId: string | null;
    createdAt: Date;
    updatedAt: Date;
    assignedTo?: {
      id: string;
      name: string;
      pole: string;
      roles: string;
      loadLevel: string;
      transversalRoles: string;
      isoActionsCompleted: number | null;
      isoActionsTotal: number | null;
      availabilityMargin: string | null;
      createdAt: Date;
      updatedAt: Date;
    } | null;
  }>;
  assignments: Array<{
    id: string;
    memberId: string;
    projectId: string;
    role: string;
    allocation: number;
    isUrgent: boolean;
    createdAt: Date;
    updatedAt: Date;
    member: {
      id: string;
      name: string;
      pole: string;
      roles: string;
      loadLevel: string;
      transversalRoles: string;
      isoActionsCompleted: number | null;
      isoActionsTotal: number | null;
      availabilityMargin: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
  }>;
}): Project {
  const modules: Module[] = row.modules.map((m) => ({
    id: m.id,
    name: m.name,
    type: moduleTypeFromDb(m.type),
    estimatedDays: m.estimatedDays,
    completedDays: m.completedDays,
    status: moduleStatusFromDb(m.status),
    projectId: m.projectId,
    assignedToId: m.assignedToId ?? undefined,
    assignedTo: m.assignedTo
      ? (toMember(
          {
            ...m.assignedTo,
            assignments: [],
          },
          false,
        ) as Member)
      : undefined,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  }));

  const assignments: Assignment[] = row.assignments.map((a) => ({
    id: a.id,
    memberId: a.memberId,
    projectId: a.projectId,
    role: assignmentRoleFromDb(a.role),
    allocation: a.allocation,
    isUrgent: a.isUrgent,
    member: toMember({ ...a.member, assignments: [] }, false) as Member,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  }));

  return {
    id: row.id,
    name: row.name,
    code: row.code,
    description: row.description ?? undefined,
    status: projectStatusFromDb(row.status),
    startDate: row.startDate,
    deadline: row.deadline,
    complexity: complexityFromDb(row.complexity),
    modules,
    assignments,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toNotification(row: {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data: string;
  isRead: boolean;
  createdAt: Date;
}): Notification {
  let data: Record<string, unknown> = {};
  try {
    data = JSON.parse(row.data) as Record<string, unknown>;
  } catch {
    /* ignore */
  }
  return {
    id: row.id,
    userId: row.userId,
    type: row.type as NotificationType,
    title: row.title,
    message: row.message,
    data,
    isRead: row.isRead,
    createdAt: row.createdAt,
  };
}

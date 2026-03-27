import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertCan } from "@/lib/permissions";
import { toProject } from "@/lib/serialize";
import { assignmentPatchSchema } from "@/lib/validations/assignment";
import { notifyAssignmentRemoved } from "@/lib/notifications";
import { updateMemberLoad } from "@/lib/utils/update-member-load";
import type { UserRole } from "@/types";

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string; assignmentId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  try {
    assertCan(session.role as UserRole, "ASSIGN_MEMBERS");
  } catch {
    return NextResponse.json({ success: false, error: "Accès refusé" }, { status: 403 });
  }

  const { id, assignmentId } = await ctx.params;
  const json = (await request.json()) as unknown;
  const parsed = assignmentPatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Données invalides" }, { status: 400 });
  }

  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId, projectId: id },
  });
  if (!assignment) {
    return NextResponse.json({ success: false, error: "Affectation introuvable" }, { status: 404 });
  }

  await prisma.assignment.update({
    where: { id: assignmentId },
    data: {
      ...(parsed.data.role && { role: parsed.data.role }),
      ...(parsed.data.allocation !== undefined && { allocation: parsed.data.allocation }),
      ...(parsed.data.isUrgent !== undefined && { isUrgent: parsed.data.isUrgent }),
    },
  });

  await updateMemberLoad(assignment.memberId);

  const updated = await prisma.project.findUnique({
    where: { id },
    include: {
      modules: { include: { assignedTo: true } },
      assignments: { include: { member: true } },
    },
  });

  return NextResponse.json({ success: true, data: toProject(updated!) });
}

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string; assignmentId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  try {
    assertCan(session.role as UserRole, "ASSIGN_MEMBERS");
  } catch {
    return NextResponse.json({ success: false, error: "Accès refusé" }, { status: 403 });
  }

  const { id, assignmentId } = await ctx.params;

  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId, projectId: id },
    include: { project: true },
  });
  if (!assignment) {
    return NextResponse.json({ success: false, error: "Affectation introuvable" }, { status: 404 });
  }

  await prisma.assignment.delete({ where: { id: assignmentId } });

  await updateMemberLoad(assignment.memberId);

  await notifyAssignmentRemoved({
    memberId: assignment.memberId,
    projectName: assignment.project.name,
    projectCode: assignment.project.code,
    projectId: assignment.projectId,
    removedBy: session.name,
  }).catch(console.error);

  const updated = await prisma.project.findUnique({
    where: { id },
    include: {
      modules: { include: { assignedTo: true } },
      assignments: { include: { member: true } },
    },
  });

  return NextResponse.json({ success: true, data: toProject(updated!) });
}

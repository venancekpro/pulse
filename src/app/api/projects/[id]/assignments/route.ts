import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertCan } from "@/lib/permissions";
import { toProject } from "@/lib/serialize";
import { assignmentCreateSchema } from "@/lib/validations/assignment";
import { notifyAssignmentAdded } from "@/lib/notifications";
import { updateMemberLoad } from "@/lib/utils/update-member-load";
import type { UserRole } from "@/types";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  const { id } = await ctx.params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      assignments: { include: { member: true } },
      modules: { include: { assignedTo: true } },
    },
  });

  if (!project) {
    return NextResponse.json({ success: false, error: "Projet introuvable" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: toProject(project) });
}

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
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

  const { id } = await ctx.params;
  const json = (await request.json()) as unknown;
  const parsed = assignmentCreateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Données invalides" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ success: false, error: "Projet introuvable" }, { status: 404 });
  }

  const existing = await prisma.assignment.findUnique({
    where: { memberId_projectId: { memberId: parsed.data.memberId, projectId: id } },
  });
  if (existing) {
    return NextResponse.json(
      { success: false, error: "Ce membre est déjà assigné à ce projet" },
      { status: 409 },
    );
  }

  await prisma.assignment.create({
    data: {
      memberId: parsed.data.memberId,
      projectId: id,
      role: parsed.data.role,
      allocation: parsed.data.allocation,
      isUrgent: parsed.data.isUrgent,
    },
  });

  await updateMemberLoad(parsed.data.memberId);

  await notifyAssignmentAdded({
    memberId: parsed.data.memberId,
    projectName: project.name,
    projectCode: project.code,
    projectId: project.id,
    addedBy: session.name,
  }).catch(console.error);

  const updated = await prisma.project.findUnique({
    where: { id },
    include: {
      modules: { include: { assignedTo: true } },
      assignments: { include: { member: true } },
    },
  });

  return NextResponse.json({ success: true, data: toProject(updated!) }, { status: 201 });
}

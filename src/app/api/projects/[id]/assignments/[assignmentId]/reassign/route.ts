import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertCan } from "@/lib/permissions";
import { toProject } from "@/lib/serialize";
import { reassignSchema } from "@/lib/validations/assignment";
import { notifyReassignment } from "@/lib/notifications";
import { updateMemberLoad } from "@/lib/utils/update-member-load";
import type { UserRole } from "@/types";

export async function POST(
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
  const parsed = reassignSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Données invalides" }, { status: 400 });
  }

  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId, projectId: id },
    include: { member: true, project: true },
  });
  if (!assignment) {
    return NextResponse.json({ success: false, error: "Affectation introuvable" }, { status: 404 });
  }

  if (assignment.memberId === parsed.data.newMemberId) {
    return NextResponse.json(
      { success: false, error: "Le membre est déjà assigné" },
      { status: 400 },
    );
  }

  const conflict = await prisma.assignment.findUnique({
    where: {
      memberId_projectId: {
        memberId: parsed.data.newMemberId,
        projectId: id,
      },
    },
  });
  if (conflict) {
    return NextResponse.json(
      { success: false, error: "Le nouveau membre est déjà assigné à ce projet" },
      { status: 409 },
    );
  }

  const newMember = await prisma.member.findUnique({
    where: { id: parsed.data.newMemberId },
  });
  if (!newMember) {
    return NextResponse.json(
      { success: false, error: "Nouveau membre introuvable" },
      { status: 404 },
    );
  }

  const oldMemberId = assignment.memberId;
  const oldMemberName = assignment.member.name;

  await prisma.assignment.update({
    where: { id: assignmentId },
    data: {
      memberId: parsed.data.newMemberId,
      ...(parsed.data.role && { role: parsed.data.role }),
      ...(parsed.data.allocation !== undefined && { allocation: parsed.data.allocation }),
    },
  });

  await Promise.all([
    updateMemberLoad(oldMemberId),
    updateMemberLoad(parsed.data.newMemberId),
  ]);

  await notifyReassignment({
    oldMemberId,
    newMemberId: parsed.data.newMemberId,
    newMemberName: newMember.name,
    projectName: assignment.project.name,
    projectCode: assignment.project.code,
    projectId: id,
    reassignedBy: session.name,
  }).catch(console.error);

  const updated = await prisma.project.findUnique({
    where: { id },
    include: {
      modules: { include: { assignedTo: true } },
      assignments: { include: { member: true } },
    },
  });

  return NextResponse.json({
    success: true,
    data: toProject(updated!),
    message: `Projet réassigné de ${oldMemberName} à ${newMember.name}`,
  });
}

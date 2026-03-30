import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertCan } from "@/lib/permissions";
import { updateMemberLoad } from "@/lib/utils/update-member-load";
import { notifyReassignment } from "@/lib/notifications";
import type { UserRole } from "@/types";

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

  const { id: sourceMemberId } = await ctx.params;
  const body = (await request.json()) as { assignmentId: string; targetMemberId: string };

  if (!body.assignmentId || !body.targetMemberId) {
    return NextResponse.json({ success: false, error: "Paramètres manquants" }, { status: 400 });
  }

  const assignment = await prisma.assignment.findUnique({
    where: { id: body.assignmentId },
    include: { project: { select: { id: true, name: true, code: true } }, member: true },
  });

  if (!assignment || assignment.memberId !== sourceMemberId) {
    return NextResponse.json({ success: false, error: "Affectation introuvable" }, { status: 404 });
  }

  // Check target not already on project
  const existing = await prisma.assignment.findUnique({
    where: { memberId_projectId: { memberId: body.targetMemberId, projectId: assignment.projectId } },
  });
  if (existing) {
    return NextResponse.json({ success: false, error: "Ce membre est déjà affecté à ce projet" }, { status: 409 });
  }

  // Check target exists
  const targetMember = await prisma.member.findUnique({ where: { id: body.targetMemberId } });
  if (!targetMember) {
    return NextResponse.json({ success: false, error: "Membre cible introuvable" }, { status: 404 });
  }

  // Perform the swap
  await prisma.assignment.update({
    where: { id: body.assignmentId },
    data: { memberId: body.targetMemberId },
  });

  // Update both member loads
  await Promise.all([
    updateMemberLoad(sourceMemberId),
    updateMemberLoad(body.targetMemberId),
  ]);

  // Notify (async, non-blocking)
  notifyReassignment({
    projectId: assignment.projectId,
    projectName: assignment.project.name,
    projectCode: assignment.project.code,
    oldMemberId: sourceMemberId,
    newMemberId: body.targetMemberId,
    newMemberName: targetMember.name,
    reassignedBy: session.name,
  }).catch(() => {});

  // Get updated loads for the response
  const [updatedSource, updatedTarget] = await Promise.all([
    prisma.member.findUnique({
      where: { id: sourceMemberId },
      include: { assignments: { include: { project: { select: { status: true } } } } },
    }),
    prisma.member.findUnique({
      where: { id: body.targetMemberId },
      include: { assignments: { include: { project: { select: { status: true } } } } },
    }),
  ]);

  const { memberBasics } = await import("@/lib/utils/load-calculator");
  const sourceLoad = updatedSource ? memberBasics(updatedSource).calculatedLoad : 0;
  const targetLoad = updatedTarget ? memberBasics(updatedTarget).calculatedLoad : 0;

  return NextResponse.json({
    success: true,
    data: {
      success: true,
      oldMemberLoad: sourceLoad,
      newMemberLoad: targetLoad,
      oldMemberName: assignment.member.name,
      newMemberName: targetMember.name,
      projectName: assignment.project.name,
    },
  });
}

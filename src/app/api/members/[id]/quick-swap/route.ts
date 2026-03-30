import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { poleFromDb } from "@/lib/mappers";
import { calculateEffectiveLoad, loadLevelFromPercent, memberBasics } from "@/lib/utils/load-calculator";
import type { MemberSkill, QuickSwapCandidate } from "@/types";
import type { Pole as PrismaPole } from "@/generated/prisma/client";

export async function GET(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const { id } = await ctx.params;
  const url = new URL(request.url);
  const assignmentId = url.searchParams.get("assignmentId");

  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      assignments: {
        include: { project: { select: { status: true, name: true, deadline: true } } },
      },
      leaves: true,
    },
  });

  if (!member) {
    return NextResponse.json({ success: false, error: "Introuvable" }, { status: 404 });
  }

  // Get the assignment to swap
  let targetAssignment: { allocation: number; role: string; projectId: string } | null = null;
  if (assignmentId) {
    const a = await prisma.assignment.findUnique({ where: { id: assignmentId } });
    if (a) targetAssignment = { allocation: a.allocation, role: a.role, projectId: a.projectId };
  }

  // Find same-pole members excluding current member
  const candidates = await prisma.member.findMany({
    where: {
      pole: member.pole,
      id: { not: id },
    },
    include: {
      assignments: {
        include: { project: { select: { status: true, name: true, deadline: true } } },
      },
      leaves: true,
    },
  });

  const results: QuickSwapCandidate[] = [];

  for (const c of candidates) {
    // Skip if already on same project
    if (targetAssignment && c.assignments.some((a) => a.projectId === targetAssignment!.projectId)) {
      continue;
    }

    const basics = memberBasics({
      id: c.id,
      name: c.name,
      pole: c.pole,
      roles: c.roles,
      transversalRoles: c.transversalRoles,
      loadLevel: c.loadLevel,
      assignments: c.assignments.map((a) => ({
        allocation: a.allocation,
        role: a.role,
        isUrgent: a.isUrgent,
        project: { status: a.project.status },
      })),
    });

    const { effectiveLoad } = calculateEffectiveLoad(basics.calculatedLoad, c.leaves);

    // Calculate projected load after receiving the assignment
    const addedLoad = targetAssignment ? targetAssignment.allocation : 20;
    const projectedLoad = Math.min(200, basics.calculatedLoad + addedLoad);

    // Skill match
    let memberSkills: MemberSkill[] = [];
    let sourceSkills: MemberSkill[] = [];
    try { memberSkills = JSON.parse(c.skills ?? "[]"); } catch { /* */ }
    try { sourceSkills = JSON.parse(member.skills ?? "[]"); } catch { /* */ }
    const sourceSkillNames = sourceSkills.map((s) => s.name.toLowerCase());
    const matchCount = memberSkills.filter((s) => sourceSkillNames.includes(s.name.toLowerCase())).length;
    const skillMatch = sourceSkillNames.length > 0 ? Math.round((matchCount / sourceSkillNames.length) * 100) : 0;

    // Availability note
    const now = new Date();
    const upcomingLeave = c.leaves.find((l) => new Date(l.startDate) > now);
    const availabilityNote = upcomingLeave
      ? `En ${c.leaves.find((l) => new Date(l.startDate) <= now && new Date(l.endDate) >= now) ? "absence" : "congé prévu"} du ${new Date(upcomingLeave.startDate).toLocaleDateString("fr-FR")}`
      : undefined;

    results.push({
      memberId: c.id,
      memberName: c.name,
      pole: poleFromDb(c.pole as PrismaPole),
      currentLoad: basics.calculatedLoad,
      effectiveLoad,
      projectedLoad,
      loadLevel: basics.loadLevel,
      projectedLevel: loadLevelFromPercent(projectedLoad),
      skillMatch,
      availabilityNote,
    });
  }

  // Sort by effective load ascending, return top 3
  results.sort((a, b) => a.effectiveLoad - b.effectiveLoad);

  return NextResponse.json({ success: true, data: results.slice(0, 3) });
}

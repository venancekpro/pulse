import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { poleFromDb } from "@/lib/mappers";
import { memberBasics } from "@/lib/utils/load-calculator";
import type { CrossPoleSuggestion, MemberSkill } from "@/types";
import type { Pole as PrismaPole } from "@/generated/prisma/client";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const body = (await request.json()) as {
    pole: string;
    requiredSkills: string[];
    excludeMemberIds?: string[];
  };

  const { pole, requiredSkills, excludeMemberIds = [] } = body;

  if (!pole || !requiredSkills?.length) {
    return NextResponse.json({ success: false, error: "Paramètres manquants" }, { status: 400 });
  }

  const members = await prisma.member.findMany({
    where: {
      pole: { not: pole as PrismaPole },
      id: { notIn: excludeMemberIds },
    },
    include: {
      assignments: {
        include: {
          project: { select: { status: true } },
        },
      },
    },
  });

  const suggestions: CrossPoleSuggestion[] = [];

  for (const m of members) {
    let skills: MemberSkill[] = [];
    try {
      skills = JSON.parse(m.skills ?? "[]") as MemberSkill[];
    } catch {
      skills = [];
    }

    const memberSkillNames = skills.map((s) => s.name.toLowerCase());
    const matching = requiredSkills.filter((rs) =>
      memberSkillNames.includes(rs.toLowerCase()),
    );

    if (matching.length === 0) continue;

    const basics = memberBasics({
      id: m.id,
      name: m.name,
      pole: m.pole,
      roles: m.roles,
      transversalRoles: m.transversalRoles,
      loadLevel: m.loadLevel,
      assignments: m.assignments.map((a) => ({
        allocation: a.allocation,
        role: a.role,
        isUrgent: a.isUrgent,
        project: { status: a.project.status },
      })),
    });

    if (basics.calculatedLoad >= 100) continue;

    const available = Math.max(5, Math.min(30, Math.floor(100 - basics.calculatedLoad)));

    suggestions.push({
      memberId: m.id,
      memberName: m.name,
      pole: poleFromDb(m.pole as PrismaPole),
      matchingSkills: matching,
      currentLoad: basics.calculatedLoad,
      suggestedAllocation: available,
      reason: `${m.name} (${poleFromDb(m.pole as PrismaPole)}) maîtrise ${matching.join(", ")} — allocation possible à ${available}%`,
    });
  }

  suggestions.sort((a, b) => a.currentLoad - b.currentLoad);

  return NextResponse.json({ success: true, data: suggestions.slice(0, 5) });
}

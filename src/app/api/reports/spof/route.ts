import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { poleFromDb } from "@/lib/mappers";
import { memberBasics } from "@/lib/utils/load-calculator";
import { detectSPOFs } from "@/lib/utils/spof-detector";
import type { Pole as PrismaPole } from "@/generated/prisma/client";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const [members, projects] = await Promise.all([
    prisma.member.findMany({
      include: {
        assignments: {
          include: { project: { select: { status: true } } },
        },
      },
    }),
    prisma.project.findMany({
      include: {
        assignments: {
          select: { memberId: true, projectId: true, role: true, allocation: true },
        },
      },
    }),
  ]);

  const mappedMembers = members.map((m) => {
    const basics = memberBasics(m);
    return {
      id: m.id,
      name: m.name,
      pole: poleFromDb(m.pole as PrismaPole),
      calculatedLoad: basics.calculatedLoad,
      loadLevel: basics.loadLevel,
    };
  });

  const mappedProjects = projects.map((p) => ({
    id: p.id,
    name: p.name,
    code: p.code,
    status: p.status,
    assignments: p.assignments.map((a) => ({
      memberId: a.memberId,
      projectId: a.projectId,
      role: a.role as "lead" | "contributeur",
      allocation: a.allocation,
    })),
  }));

  const result = detectSPOFs(mappedMembers, mappedProjects);

  return NextResponse.json({ success: true, data: result });
}

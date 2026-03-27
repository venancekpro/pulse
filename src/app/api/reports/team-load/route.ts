import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { memberBasics } from "@/lib/utils/load-calculator";
import { poleFromDb } from "@/lib/mappers";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const members = await prisma.member.findMany({
    include: {
      assignments: { include: { project: true } },
    },
    orderBy: { name: "asc" },
  });

  const rows = members.map((m) => {
    const b = memberBasics({
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
    return {
      member: m.name,
      pole: poleFromDb(m.pole),
      calculatedLoad: b.calculatedLoad,
      loadLevel: b.loadLevel,
      projectCount: b.projectCount,
      iso:
        m.isoActionsTotal != null
          ? `${m.isoActionsCompleted ?? 0}/${m.isoActionsTotal}`
          : null,
    };
  });

  return NextResponse.json({ success: true, data: rows });
}

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertCan } from "@/lib/permissions";
import { memberBasics } from "@/lib/utils/load-calculator";
import { poleFromDb } from "@/lib/mappers";
import type { UserRole } from "@/types";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  try {
    assertCan(session.role as UserRole, "EXPORT_REPORTS");
  } catch {
    return NextResponse.json({ success: false, error: "Export réservé aux administrateurs" }, { status: 403 });
  }

  const members = await prisma.member.findMany({
    include: {
      assignments: { include: { project: true } },
    },
  });

  const header = ["Membre", "Pôle", "Charge_%", "Niveau", "Projets_actifs", "ISO"].join(";");
  const lines = members.map((m) => {
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
    const iso =
      m.isoActionsTotal != null
        ? `${m.isoActionsCompleted ?? 0}/${m.isoActionsTotal}`
        : "";
    return [m.name, poleFromDb(m.pole), String(b.calculatedLoad), b.loadLevel, String(b.projectCount), iso].join(
      ";",
    );
  });

  const csv = [header, ...lines].join("\n");
  const filename = `pulse-charge-equipe-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

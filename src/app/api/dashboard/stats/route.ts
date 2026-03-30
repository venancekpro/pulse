import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { calculateEffectiveLoad, memberBasics } from "@/lib/utils/load-calculator";
import { detectSPOFs } from "@/lib/utils/spof-detector";
import { poleFromDb } from "@/lib/mappers";
import type { DashboardStats, Pole, PoleStats } from "@/types";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const [members, projects] = await Promise.all([
    prisma.member.findMany({
      include: {
        assignments: {
          include: { project: true },
        },
        leaves: true,
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

  const activeProjects = projects.filter((p) => p.status !== "livre").length;
  const overload: { pole: Pole; load: number; effectiveLoad: number; level: string }[] = [];

  for (const m of members) {
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
    const { effectiveLoad } = calculateEffectiveLoad(b.calculatedLoad, m.leaves);
    overload.push({
      pole: b.pole,
      load: b.calculatedLoad,
      effectiveLoad,
      level: b.loadLevel,
    });
  }

  const membersInOverload = overload.filter((o) => o.level === "critique" || o.level === "elevee").length;
  const overloadPercentage =
    members.length > 0 ? Math.round((membersInOverload / members.length) * 100) : 0;

  const poles: Pole[] = ["front", "back", "devops", "ux-ui"];
  const poleStats: PoleStats[] = poles.map((pole) => {
    const inPole = overload.filter((o) => o.pole === pole);
    const avg =
      inPole.length > 0
        ? Math.round((inPole.reduce((s, x) => s + x.load, 0) / inPole.length) * 10) / 10
        : 0;
    const criticalCount = inPole.filter((x) => x.level === "critique").length;
    return {
      pole,
      memberCount: members.filter((m) => poleFromDb(m.pole) === pole).length,
      avgLoad: avg,
      criticalCount,
    };
  });

  // SPOF detection
  const mappedMembers = members.map((m) => {
    const b = memberBasics(m);
    return { id: m.id, name: m.name, pole: poleFromDb(m.pole), calculatedLoad: b.calculatedLoad, loadLevel: b.loadLevel };
  });
  const mappedProjects = projects.map((p) => ({
    id: p.id, name: p.name, code: p.code, status: p.status,
    assignments: p.assignments.map((a) => ({
      memberId: a.memberId, projectId: a.projectId,
      role: a.role as "lead" | "contributeur", allocation: a.allocation,
    })),
  }));
  const spofResult = detectSPOFs(mappedMembers, mappedProjects);

  const stats: DashboardStats = {
    totalMembers: members.length,
    totalProjects: projects.length,
    activeProjects,
    membersInOverload,
    overloadPercentage,
    poleStats,
    spofCount: spofResult.totalSPOFs,
    criticalSpofCount: spofResult.criticalSPOFs,
  };

  return NextResponse.json({ success: true, data: stats });
}

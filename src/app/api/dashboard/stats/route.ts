import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { memberBasics } from "@/lib/utils/load-calculator";
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
      },
    }),
    prisma.project.findMany(),
  ]);

  const activeProjects = projects.filter((p) => p.status !== "livre").length;
  const overload: { pole: Pole; load: number; level: string }[] = [];

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
    overload.push({
      pole: b.pole,
      load: b.calculatedLoad,
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

  const stats: DashboardStats = {
    totalMembers: members.length,
    totalProjects: projects.length,
    activeProjects,
    membersInOverload,
    overloadPercentage,
    poleStats,
  };

  return NextResponse.json({ success: true, data: stats });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertCan } from "@/lib/permissions";
import { runImpactSimulation } from "@/lib/utils/impact-simulator";
import type { SimulationAssignment, SimulationProjectData, UserRole } from "@/types";

const bodySchema = z.object({
  projectData: z.object({
    name: z.string().min(1),
    code: z.string().min(1),
    deadline: z.string(),
    complexity: z.enum(["faible", "moyenne", "haute", "critique"]),
    modules: z.array(z.object({ name: z.string(), estimatedDays: z.number().positive() })),
  }),
  assignments: z.array(
    z.object({
      memberId: z.string(),
      memberName: z.string(),
      allocation: z.number().min(0).max(100),
      role: z.enum(["lead", "contributeur"]),
    }),
  ),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  try {
    assertCan(session.role as UserRole, "RUN_SIMULATION");
  } catch {
    return NextResponse.json({ success: false, error: "Réservé aux administrateurs" }, { status: 403 });
  }

  const json = (await request.json()) as unknown;
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Données invalides" }, { status: 400 });
  }

  const members = await prisma.member.findMany({
    include: {
      assignments: {
        include: {
          project: {
            select: { status: true, name: true, deadline: true },
          },
        },
      },
    },
  });

  const result = runImpactSimulation(
    members.map((m) => ({
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
        project: {
          status: a.project.status,
          name: a.project.name,
          deadline: a.project.deadline,
        },
      })),
    })),
    parsed.data.projectData as SimulationProjectData,
    parsed.data.assignments as SimulationAssignment[],
  );

  return NextResponse.json({ success: true, data: result });
}

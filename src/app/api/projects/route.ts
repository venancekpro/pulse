import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { DEFAULT_MODULES } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { assertCan } from "@/lib/permissions";
import { toProject } from "@/lib/serialize";
import { projectCreateSchema } from "@/lib/validations/project";
import { moduleStatusToDb, projectStatusToDb } from "@/lib/mappers";
import type { UserRole } from "@/types";
import { ModuleType } from "@/generated/prisma/client";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const rows = await prisma.project.findMany({
    include: {
      modules: { include: { assignedTo: true } },
      assignments: { include: { member: true } },
    },
    orderBy: { deadline: "asc" },
  });

  return NextResponse.json({
    success: true,
    data: rows.map((r) => toProject(r)),
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  try {
    assertCan(session.role as UserRole, "CREATE_PROJECT");
  } catch {
    return NextResponse.json({ success: false, error: "Accès refusé" }, { status: 403 });
  }

  const json = (await request.json()) as unknown;
  const parsed = projectCreateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Données invalides" }, { status: 400 });
  }

  const { customModules, ...rest } = parsed.data;
  const mods =
    customModules && customModules.length > 0
      ? customModules
      : DEFAULT_MODULES.map((m) => ({
          name: m.name,
          estimatedDays: m.estimatedDays,
          type: "default" as const,
        }));

  const row = await prisma.project.create({
    data: {
      name: rest.name,
      code: rest.code.toUpperCase(),
      description: rest.description,
      status: projectStatusToDb(rest.status),
      startDate: new Date(rest.startDate),
      deadline: new Date(rest.deadline),
      complexity: rest.complexity,
      modules: {
        create: mods.map((m) => ({
          name: m.name,
          type: m.type === "custom" ? ModuleType.custom : ModuleType.default,
          estimatedDays: m.estimatedDays,
          completedDays: "completedDays" in m && m.completedDays != null ? m.completedDays : 0,
          status: moduleStatusToDb("status" in m && m.status ? m.status : "todo"),
        })),
      },
    },
    include: {
      modules: { include: { assignedTo: true } },
      assignments: { include: { member: true } },
    },
  });

  return NextResponse.json({ success: true, data: toProject(row) }, { status: 201 });
}

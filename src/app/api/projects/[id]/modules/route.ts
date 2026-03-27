import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertCan } from "@/lib/permissions";
import { toProject } from "@/lib/serialize";
import { moduleCreateSchema } from "@/lib/validations/project";
import { moduleStatusToDb } from "@/lib/mappers";
import type { UserRole } from "@/types";
import { ModuleType } from "@/generated/prisma/client";

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  try {
    assertCan(session.role as UserRole, "EDIT_PROJECT");
  } catch {
    return NextResponse.json({ success: false, error: "Accès refusé" }, { status: 403 });
  }

  const { id: projectId } = await ctx.params;
  const json = (await request.json()) as unknown;
  const parsed = moduleCreateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Données invalides" }, { status: 400 });
  }

  await prisma.module.create({
    data: {
      projectId,
      name: parsed.data.name,
      estimatedDays: parsed.data.estimatedDays,
      type: parsed.data.type === "custom" ? ModuleType.custom : ModuleType.default,
      completedDays: 0,
      status: moduleStatusToDb("todo"),
    },
  });

  const row = await prisma.project.findUniqueOrThrow({
    where: { id: projectId },
    include: {
      modules: { include: { assignedTo: true } },
      assignments: { include: { member: true } },
    },
  });

  return NextResponse.json({ success: true, data: toProject(row) }, { status: 201 });
}

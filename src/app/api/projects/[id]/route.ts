import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertCan } from "@/lib/permissions";
import { toProject } from "@/lib/serialize";
import { projectPatchSchema } from "@/lib/validations/project";
import { moduleStatusToDb, projectStatusToDb } from "@/lib/mappers";
import type { UserRole } from "@/types";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  const { id } = await ctx.params;

  const row = await prisma.project.findUnique({
    where: { id },
    include: {
      modules: { include: { assignedTo: true } },
      assignments: { include: { member: true } },
    },
  });

  if (!row) {
    return NextResponse.json({ success: false, error: "Introuvable" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: toProject(row) });
}

export async function PATCH(
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

  const { id } = await ctx.params;
  const json = (await request.json()) as unknown;
  const parsed = projectPatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Données invalides" }, { status: 400 });
  }

  const row = await prisma.project.update({
    where: { id },
    data: {
      ...(parsed.data.name && { name: parsed.data.name }),
      ...(parsed.data.code && { code: parsed.data.code.toUpperCase() }),
      ...(parsed.data.description !== undefined && { description: parsed.data.description }),
      ...(parsed.data.status && { status: projectStatusToDb(parsed.data.status) }),
      ...(parsed.data.startDate && { startDate: new Date(parsed.data.startDate) }),
      ...(parsed.data.deadline && { deadline: new Date(parsed.data.deadline) }),
      ...(parsed.data.complexity && { complexity: parsed.data.complexity }),
    },
    include: {
      modules: { include: { assignedTo: true } },
      assignments: { include: { member: true } },
    },
  });

  return NextResponse.json({ success: true, data: toProject(row) });
}

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  try {
    assertCan(session.role as UserRole, "DELETE_PROJECT");
  } catch {
    return NextResponse.json({ success: false, error: "Accès refusé" }, { status: 403 });
  }

  const { id } = await ctx.params;
  await prisma.project.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

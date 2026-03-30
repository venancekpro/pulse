import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertCan } from "@/lib/permissions";
import { toMember } from "@/lib/serialize";
import { memberPatchSchema } from "@/lib/validations/member";
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

  const row = await prisma.member.findUnique({
    where: { id },
    include: {
      assignments: {
        include: {
          project: {
            select: {
              id: true,
              name: true,
              code: true,
              status: true,
              startDate: true,
              deadline: true,
              complexity: true,
            },
          },
        },
      },
      leaves: { orderBy: { startDate: "asc" } },
    },
  });

  if (!row) {
    return NextResponse.json({ success: false, error: "Introuvable" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: toMember(row, true) });
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
    assertCan(session.role as UserRole, "EDIT_MEMBER_LOAD");
  } catch {
    return NextResponse.json({ success: false, error: "Accès refusé" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const json = (await request.json()) as unknown;
  const parsed = memberPatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Données invalides" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (parsed.data.loadLevel) data.loadLevel = parsed.data.loadLevel;
  if (parsed.data.availabilityMargin !== undefined) data.availabilityMargin = parsed.data.availabilityMargin;
  if (parsed.data.isoActionsCompleted !== undefined) data.isoActionsCompleted = parsed.data.isoActionsCompleted;
  if (parsed.data.isoActionsTotal !== undefined) data.isoActionsTotal = parsed.data.isoActionsTotal;
  if (parsed.data.skills !== undefined) data.skills = JSON.stringify(parsed.data.skills);

  const row = await prisma.member.update({
    where: { id },
    data,
    include: {
      assignments: {
        include: {
          project: {
            select: {
              id: true,
              name: true,
              code: true,
              status: true,
              deadline: true,
            },
          },
        },
      },
      leaves: { orderBy: { startDate: "asc" } },
    },
  });

  return NextResponse.json({ success: true, data: toMember(row, true) });
}

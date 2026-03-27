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

  const row = await prisma.member.update({
    where: { id },
    data: {
      ...(parsed.data.loadLevel && { loadLevel: parsed.data.loadLevel }),
      ...(parsed.data.availabilityMargin !== undefined && {
        availabilityMargin: parsed.data.availabilityMargin,
      }),
      ...(parsed.data.isoActionsCompleted !== undefined && {
        isoActionsCompleted: parsed.data.isoActionsCompleted,
      }),
      ...(parsed.data.isoActionsTotal !== undefined && {
        isoActionsTotal: parsed.data.isoActionsTotal,
      }),
    },
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
    },
  });

  return NextResponse.json({ success: true, data: toMember(row, true) });
}

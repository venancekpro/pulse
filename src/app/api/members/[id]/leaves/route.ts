import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertCan } from "@/lib/permissions";
import { toLeave } from "@/lib/serialize";
import { leaveCreateSchema } from "@/lib/validations/leave";
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

  const rows = await prisma.leave.findMany({
    where: { memberId: id },
    orderBy: { startDate: "asc" },
  });

  return NextResponse.json({ success: true, data: rows.map(toLeave) });
}

export async function POST(
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
  const parsed = leaveCreateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Données invalides" }, { status: 400 });
  }

  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) {
    return NextResponse.json({ success: false, error: "Membre introuvable" }, { status: 404 });
  }

  const row = await prisma.leave.create({
    data: {
      memberId: id,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
      type: parsed.data.type,
      description: parsed.data.description,
    },
  });

  return NextResponse.json({ success: true, data: toLeave(row) }, { status: 201 });
}

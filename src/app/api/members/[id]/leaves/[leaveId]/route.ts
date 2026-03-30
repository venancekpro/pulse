import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertCan } from "@/lib/permissions";
import { toLeave } from "@/lib/serialize";
import { leavePatchSchema } from "@/lib/validations/leave";
import type { UserRole } from "@/types";

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string; leaveId: string }> },
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

  const { id, leaveId } = await ctx.params;
  const json = (await request.json()) as unknown;
  const parsed = leavePatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Données invalides" }, { status: 400 });
  }

  const existing = await prisma.leave.findFirst({
    where: { id: leaveId, memberId: id },
  });
  if (!existing) {
    return NextResponse.json({ success: false, error: "Absence introuvable" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (parsed.data.startDate) data.startDate = new Date(parsed.data.startDate);
  if (parsed.data.endDate) data.endDate = new Date(parsed.data.endDate);
  if (parsed.data.type) data.type = parsed.data.type;
  if (parsed.data.description !== undefined) data.description = parsed.data.description;

  const row = await prisma.leave.update({
    where: { id: leaveId },
    data,
  });

  return NextResponse.json({ success: true, data: toLeave(row) });
}

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string; leaveId: string }> },
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

  const { id, leaveId } = await ctx.params;
  const existing = await prisma.leave.findFirst({
    where: { id: leaveId, memberId: id },
  });
  if (!existing) {
    return NextResponse.json({ success: false, error: "Absence introuvable" }, { status: 404 });
  }

  await prisma.leave.delete({ where: { id: leaveId } });

  return NextResponse.json({ success: true });
}

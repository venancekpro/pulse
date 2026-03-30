import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { poleFromDb } from "@/lib/mappers";
import { calculateMemberReliability } from "@/lib/utils/reliability-calculator";
import type { Pole as PrismaPole } from "@/generated/prisma/client";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  const { id } = await ctx.params;

  const member = await prisma.member.findUnique({
    where: { id },
    select: { id: true, name: true, pole: true },
  });
  if (!member) {
    return NextResponse.json({ success: false, error: "Introuvable" }, { status: 404 });
  }

  const modules = await prisma.module.findMany({
    where: { assignedToId: id },
    select: { estimatedDays: true, completedDays: true, status: true, assignedToId: true },
  });

  const score = calculateMemberReliability(
    member.id,
    member.name,
    poleFromDb(member.pole as PrismaPole),
    modules,
  );

  return NextResponse.json({ success: true, data: score });
}

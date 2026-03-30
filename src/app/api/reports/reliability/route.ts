import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { poleFromDb } from "@/lib/mappers";
import { calculateMemberReliability, calculatePoleReliability } from "@/lib/utils/reliability-calculator";
import type { Pole as PrismaPole } from "@/generated/prisma/client";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const [members, modules] = await Promise.all([
    prisma.member.findMany({ select: { id: true, name: true, pole: true } }),
    prisma.module.findMany({
      select: { estimatedDays: true, completedDays: true, status: true, assignedToId: true },
    }),
  ]);

  const mappedMembers = members.map((m) => ({
    id: m.id,
    name: m.name,
    pole: poleFromDb(m.pole as PrismaPole),
  }));

  const memberScores = mappedMembers.map((m) =>
    calculateMemberReliability(m.id, m.name, m.pole, modules),
  );

  const poleScores = calculatePoleReliability(modules, mappedMembers);

  return NextResponse.json({
    success: true,
    data: { memberScores, poleScores },
  });
}

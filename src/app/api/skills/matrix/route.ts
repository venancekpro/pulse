import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { poleFromDb } from "@/lib/mappers";
import type { MemberSkill, SkillMatrixEntry } from "@/types";
import type { Pole as PrismaPole } from "@/generated/prisma/client";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const members = await prisma.member.findMany({
    select: { id: true, name: true, pole: true, skills: true },
    orderBy: [{ pole: "asc" }, { name: "asc" }],
  });

  const data: SkillMatrixEntry[] = members.map((m) => {
    let skills: MemberSkill[] = [];
    try {
      skills = JSON.parse(m.skills ?? "[]") as MemberSkill[];
    } catch {
      skills = [];
    }
    return {
      memberId: m.id,
      memberName: m.name,
      pole: poleFromDb(m.pole as PrismaPole),
      skills,
    };
  });

  return NextResponse.json({ success: true, data });
}

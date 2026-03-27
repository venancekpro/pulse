import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toMember } from "@/lib/serialize";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const rows = await prisma.member.findMany({
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
    orderBy: [{ pole: "asc" }, { name: "asc" }],
  });

  const data = rows.map((r) => toMember(r, true));

  return NextResponse.json({ success: true, data });
}

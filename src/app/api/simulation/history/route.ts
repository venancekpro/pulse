import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertCan } from "@/lib/permissions";
import type { UserRole } from "@/types";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  try {
    assertCan(session.role as UserRole, "USE_SIMULATOR");
  } catch {
    return NextResponse.json({ success: false, error: "Accès refusé" }, { status: 403 });
  }

  const rows = await prisma.simulation.findMany({
    where: { createdById: session.sub },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      createdAt: true,
      projectData: true,
    },
  });

  const data = rows.map((r) => ({
    id: r.id,
    createdAt: r.createdAt,
    projectData: JSON.parse(r.projectData) as { name?: string; code?: string },
  }));

  return NextResponse.json({ success: true, data });
}

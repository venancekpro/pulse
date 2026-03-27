import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertCan } from "@/lib/permissions";
import type { UserRole } from "@/types";

const bodySchema = z.object({
  projectData: z.record(z.string(), z.unknown()),
  assignments: z.array(z.record(z.string(), z.unknown())),
  results: z.record(z.string(), z.unknown()),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  try {
    assertCan(session.role as UserRole, "RUN_SIMULATION");
  } catch {
    return NextResponse.json({ success: false, error: "Accès refusé" }, { status: 403 });
  }

  const json = (await request.json()) as unknown;
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Données invalides" }, { status: 400 });
  }

  const sim = await prisma.simulation.create({
    data: {
      createdById: session.sub,
      projectData: JSON.stringify(parsed.data.projectData),
      assignments: JSON.stringify(parsed.data.assignments),
      results: JSON.stringify(parsed.data.results),
    },
  });

  return NextResponse.json({
    success: true,
    data: { id: sim.id, createdAt: sim.createdAt },
  });
}

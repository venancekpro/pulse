import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const markReadSchema = z.union([
  z.object({ all: z.literal(true) }),
  z.object({ ids: z.array(z.string().min(1)).min(1) }),
]);

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const json = (await request.json()) as unknown;
  const parsed = markReadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Données invalides" }, { status: 400 });
  }

  if ("all" in parsed.data) {
    await prisma.notification.updateMany({
      where: { userId: session.sub, isRead: false },
      data: { isRead: true },
    });
  } else {
    await prisma.notification.updateMany({
      where: { id: { in: parsed.data.ids }, userId: session.sub },
      data: { isRead: true },
    });
  }

  return NextResponse.json({ success: true });
}

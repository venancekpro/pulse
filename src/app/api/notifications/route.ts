import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toNotification } from "@/lib/serialize";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: session.sub },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.notification.count({
      where: { userId: session.sub, isRead: false },
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      notifications: notifications.map(toNotification),
      unreadCount,
    },
  });
}

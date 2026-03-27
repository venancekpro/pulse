import { prisma } from "@/lib/db";
import { calculateMemberLoad, loadLevelFromPercent } from "@/lib/utils/load-calculator";

/**
 * Recalcule et met à jour le loadLevel d'un membre en base
 * à partir de ses assignments actuels et rôles transversaux.
 */
export async function updateMemberLoad(memberId: string): Promise<void> {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    include: {
      assignments: {
        include: {
          project: { select: { status: true } },
        },
      },
    },
  });
  if (!member) return;

  let transversalRoles: string[] = [];
  try {
    transversalRoles = JSON.parse(member.transversalRoles) as string[];
  } catch {
    /* ignore */
  }

  const load = calculateMemberLoad({
    assignments: member.assignments.map((a) => ({
      allocation: a.allocation,
      role: a.role,
      isUrgent: a.isUrgent,
      project: { status: a.project.status },
    })),
    transversalRoles,
  });

  const newLevel = loadLevelFromPercent(load);

  if (member.loadLevel !== newLevel) {
    await prisma.member.update({
      where: { id: memberId },
      data: { loadLevel: newLevel },
    });
  }
}

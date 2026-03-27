import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { assignmentRemovedEmail, assignmentReassignedEmail } from "@/lib/email-templates";

export async function notifyAssignmentRemoved(params: {
  memberId: string;
  projectName: string;
  projectCode: string;
  projectId: string;
  removedBy: string;
}): Promise<void> {
  const user = await prisma.user.findFirst({
    where: { memberId: params.memberId },
  });
  if (!user) return;

  await prisma.notification.create({
    data: {
      userId: user.id,
      type: "assignment_removed",
      title: `Retrait du projet ${params.projectCode}`,
      message: `Vous avez été retiré du projet ${params.projectName} par ${params.removedBy}.`,
      data: JSON.stringify({
        projectId: params.projectId,
        projectName: params.projectName,
        projectCode: params.projectCode,
      }),
    },
  });

  const tpl = assignmentRemovedEmail({
    memberName: user.name,
    projectName: params.projectName,
    projectCode: params.projectCode,
    removedBy: params.removedBy,
  });
  await sendEmail({ to: user.email, ...tpl }).catch(console.error);
}

export async function notifyAssignmentAdded(params: {
  memberId: string;
  projectName: string;
  projectCode: string;
  projectId: string;
  addedBy: string;
}): Promise<void> {
  const user = await prisma.user.findFirst({
    where: { memberId: params.memberId },
  });
  if (!user) return;

  await prisma.notification.create({
    data: {
      userId: user.id,
      type: "assignment_added",
      title: `Nouvelle affectation : ${params.projectCode}`,
      message: `Vous avez été affecté au projet ${params.projectName} par ${params.addedBy}.`,
      data: JSON.stringify({
        projectId: params.projectId,
        projectName: params.projectName,
        projectCode: params.projectCode,
      }),
    },
  });
}

export async function notifyReassignment(params: {
  oldMemberId: string;
  newMemberId: string;
  newMemberName: string;
  projectName: string;
  projectCode: string;
  projectId: string;
  reassignedBy: string;
}): Promise<void> {
  const oldUser = await prisma.user.findFirst({
    where: { memberId: params.oldMemberId },
  });

  if (oldUser) {
    await prisma.notification.create({
      data: {
        userId: oldUser.id,
        type: "assignment_removed",
        title: `Retrait du projet ${params.projectCode}`,
        message: `Votre affectation sur ${params.projectName} a été transférée à ${params.newMemberName} par ${params.reassignedBy}.`,
        data: JSON.stringify({
          projectId: params.projectId,
          projectName: params.projectName,
          projectCode: params.projectCode,
          newMemberName: params.newMemberName,
        }),
      },
    });

    const tpl = assignmentReassignedEmail({
      oldMemberName: oldUser.name,
      newMemberName: params.newMemberName,
      projectName: params.projectName,
      projectCode: params.projectCode,
      reassignedBy: params.reassignedBy,
    });
    await sendEmail({ to: oldUser.email, ...tpl }).catch(console.error);
  }

  await notifyAssignmentAdded({
    memberId: params.newMemberId,
    projectName: params.projectName,
    projectCode: params.projectCode,
    projectId: params.projectId,
    addedBy: params.reassignedBy,
  });
}

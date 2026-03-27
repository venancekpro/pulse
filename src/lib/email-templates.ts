export function assignmentRemovedEmail(params: {
  memberName: string;
  projectName: string;
  projectCode: string;
  removedBy: string;
}): { subject: string; html: string } {
  return {
    subject: `[PULSE] Vous avez été retiré du projet ${params.projectCode}`,
    html: `
      <h2>Retrait du projet ${params.projectName}</h2>
      <p>Bonjour ${params.memberName},</p>
      <p>Vous avez été retiré du projet <strong>${params.projectName} (${params.projectCode})</strong> par ${params.removedBy}.</p>
      <p>Si vous pensez qu'il s'agit d'une erreur, veuillez contacter votre responsable.</p>
      <p>— L'équipe PULSE</p>
    `,
  };
}

export function assignmentReassignedEmail(params: {
  oldMemberName: string;
  newMemberName: string;
  projectName: string;
  projectCode: string;
  reassignedBy: string;
}): { subject: string; html: string } {
  return {
    subject: `[PULSE] Réassignation sur le projet ${params.projectCode}`,
    html: `
      <h2>Réassignation du projet ${params.projectName}</h2>
      <p>Bonjour ${params.oldMemberName},</p>
      <p>Votre affectation sur le projet <strong>${params.projectName} (${params.projectCode})</strong> a été transférée à <strong>${params.newMemberName}</strong> par ${params.reassignedBy}.</p>
      <p>— L'équipe PULSE</p>
    `,
  };
}

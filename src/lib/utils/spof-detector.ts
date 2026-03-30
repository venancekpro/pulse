import type {
  AssignmentRole,
  DependencyEdge,
  DependencyRadarResult,
  LoadLevel,
  Pole,
  SPOFAlert,
} from "@/types";

interface MemberInput {
  id: string;
  name: string;
  pole: Pole;
  calculatedLoad: number;
  loadLevel: LoadLevel;
}

interface AssignmentInput {
  memberId: string;
  projectId: string;
  role: AssignmentRole;
  allocation: number;
}

interface ProjectInput {
  id: string;
  name: string;
  code: string;
  status: string;
  assignments: AssignmentInput[];
}

export function detectSPOFs(
  members: MemberInput[],
  projects: ProjectInput[],
): DependencyRadarResult {
  const activeProjects = projects.filter((p) => p.status !== "livre");
  const memberMap = new Map(members.map((m) => [m.id, m]));

  // Find projects with only 1 assigned member
  const soloProjectsByMember = new Map<string, ProjectInput[]>();

  for (const project of activeProjects) {
    const uniqueMembers = new Set(project.assignments.map((a) => a.memberId));
    if (uniqueMembers.size === 1) {
      const memberId = [...uniqueMembers][0];
      if (!soloProjectsByMember.has(memberId)) {
        soloProjectsByMember.set(memberId, []);
      }
      soloProjectsByMember.get(memberId)!.push(project);
    }
  }

  // Build SPOF alerts for members with 2+ solo projects
  const spofAlerts: SPOFAlert[] = [];

  for (const [memberId, soloProjects] of soloProjectsByMember) {
    if (soloProjects.length < 2) continue;

    const member = memberMap.get(memberId);
    if (!member) continue;

    const isHighLoad = member.loadLevel === "elevee" || member.loadLevel === "critique";
    const hasUrgentProject = soloProjects.some((p) => p.status === "urgent");

    let riskLevel: SPOFAlert["riskLevel"] = "medium";
    if (soloProjects.length >= 3 && isHighLoad) riskLevel = "critical";
    else if (soloProjects.length >= 3 || hasUrgentProject) riskLevel = "high";

    spofAlerts.push({
      memberId: member.id,
      memberName: member.name,
      pole: member.pole,
      currentLoad: member.calculatedLoad,
      soloProjects: soloProjects.map((p) => {
        const assignment = p.assignments.find((a) => a.memberId === memberId)!;
        return {
          projectId: p.id,
          projectName: p.name,
          projectCode: p.code,
          role: assignment.role,
          allocation: assignment.allocation,
        };
      }),
      riskLevel,
      impactMessage: `Si ${member.name} est indisponible, ${soloProjects.length} projet${soloProjects.length > 1 ? "s" : ""} ${soloProjects.length > 1 ? "sont bloqués" : "est bloqué"}`,
      blockedProjectCount: soloProjects.length,
    });
  }

  spofAlerts.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2 };
    return order[a.riskLevel] - order[b.riskLevel];
  });

  // Build dependency edges
  const edges: DependencyEdge[] = [];
  for (const project of activeProjects) {
    const uniqueMembers = new Set(project.assignments.map((a) => a.memberId));
    const isSoleMember = uniqueMembers.size === 1;

    for (const assignment of project.assignments) {
      const member = memberMap.get(assignment.memberId);
      if (!member) continue;

      edges.push({
        source: member.id,
        sourceName: member.name,
        target: project.id,
        targetName: project.name,
        role: assignment.role,
        allocation: assignment.allocation,
        isSoleMember,
      });
    }
  }

  return {
    spofAlerts,
    edges,
    totalSPOFs: spofAlerts.length,
    criticalSPOFs: spofAlerts.filter((a) => a.riskLevel === "critical").length,
  };
}

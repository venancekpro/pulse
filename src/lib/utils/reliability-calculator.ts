import type { CorrectedEstimate, Pole, ReliabilityBias, ReliabilityConfidence, ReliabilityScore } from "@/types";

interface ModuleInput {
  estimatedDays: number;
  completedDays: number;
  status: string;
  assignedToId?: string | null;
}

interface MemberInput {
  id: string;
  name: string;
  pole: Pole;
}

function getConfidence(completedCount: number): ReliabilityConfidence {
  if (completedCount >= 5) return "haute";
  if (completedCount >= 3) return "moyenne";
  return "faible";
}

function getBias(ratio: number): ReliabilityBias {
  if (ratio > 1.15) return "optimiste";
  if (ratio < 0.85) return "pessimiste";
  return "realiste";
}

export function calculateMemberReliability(
  memberId: string,
  memberName: string,
  pole: Pole,
  modules: ModuleInput[],
): ReliabilityScore {
  const assigned = modules.filter((m) => m.assignedToId === memberId);
  const completed = assigned.filter((m) => m.status === "done" || m.completedDays > 0);

  const totalEstimatedDays = completed.reduce((s, m) => s + m.estimatedDays, 0);
  const totalActualDays = completed.reduce((s, m) => s + (m.completedDays > 0 ? m.completedDays : m.estimatedDays), 0);

  const ratio = totalEstimatedDays > 0 ? totalActualDays / totalEstimatedDays : 1;
  const confidence = getConfidence(completed.length);

  return {
    memberId,
    memberName,
    pole,
    totalModules: assigned.length,
    completedModules: completed.length,
    totalEstimatedDays,
    totalActualDays,
    ratio: Math.round(ratio * 100) / 100,
    bias: getBias(ratio),
    correctionFactor: Math.round(ratio * 100) / 100,
    confidence,
  };
}

export function calculatePoleReliability(
  modules: ModuleInput[],
  members: MemberInput[],
): ReliabilityScore[] {
  const poleMap = new Map<Pole, { memberIds: Set<string>; memberNames: string[] }>();

  for (const m of members) {
    if (!poleMap.has(m.pole)) {
      poleMap.set(m.pole, { memberIds: new Set(), memberNames: [] });
    }
    const entry = poleMap.get(m.pole)!;
    entry.memberIds.add(m.id);
    entry.memberNames.push(m.name);
  }

  const results: ReliabilityScore[] = [];

  for (const [pole, { memberIds }] of poleMap) {
    const poleModules = modules.filter((m) => m.assignedToId && memberIds.has(m.assignedToId));
    const completed = poleModules.filter((m) => m.status === "done" || m.completedDays > 0);

    const totalEstimatedDays = completed.reduce((s, m) => s + m.estimatedDays, 0);
    const totalActualDays = completed.reduce((s, m) => s + (m.completedDays > 0 ? m.completedDays : m.estimatedDays), 0);

    const ratio = totalEstimatedDays > 0 ? totalActualDays / totalEstimatedDays : 1;

    results.push({
      pole,
      totalModules: poleModules.length,
      completedModules: completed.length,
      totalEstimatedDays,
      totalActualDays,
      ratio: Math.round(ratio * 100) / 100,
      bias: getBias(ratio),
      correctionFactor: Math.round(ratio * 100) / 100,
      confidence: getConfidence(completed.length),
    });
  }

  return results;
}

export function correctEstimate(rawDays: number, reliability: ReliabilityScore): CorrectedEstimate {
  if (reliability.confidence === "faible") {
    return {
      rawDays,
      correctedDays: rawDays,
      correctionFactor: 1,
      confidence: "faible",
    };
  }

  const correctedDays = Math.round(rawDays * reliability.correctionFactor * 10) / 10;

  return {
    rawDays,
    correctedDays,
    correctionFactor: reliability.correctionFactor,
    confidence: reliability.confidence,
  };
}

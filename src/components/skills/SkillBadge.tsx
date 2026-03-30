import { SKILL_LEVEL_COLORS, SKILL_LEVEL_LABELS } from "@/lib/constants";
import type { MemberSkill } from "@/types";

interface SkillBadgeProps {
  skill: MemberSkill;
  size?: "sm" | "md";
}

export function SkillBadge({ skill, size = "sm" }: SkillBadgeProps) {
  const color = SKILL_LEVEL_COLORS[skill.level];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 ${size === "sm" ? "py-0.5 text-xs" : "py-1 text-sm"}`}
      style={{ borderColor: `${color}40` }}
    >
      <span className="font-medium">{skill.name}</span>
      <span className="text-muted-foreground" style={{ color }}>{SKILL_LEVEL_LABELS[skill.level]}</span>
    </span>
  );
}

"use client";
import { useEffect, useState } from "react";
import { SKILL_LEVEL_COLORS, SKILL_LEVEL_LABELS, POLE_LABELS } from "@/lib/constants";
import type { SkillMatrixEntry } from "@/types";

export function SkillsMatrix() {
  const [entries, setEntries] = useState<SkillMatrixEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/skills/matrix")
      .then((r) => r.json())
      .then((json) => { if (json.success) setEntries(json.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-sm text-muted-foreground">Chargement...</div>;
  if (entries.length === 0) return <div className="text-sm text-muted-foreground">Aucune donnée</div>;

  const allSkills = [...new Set(entries.flatMap((e) => e.skills.map((s) => s.name)))].sort();
  if (allSkills.length === 0) return <div className="text-sm text-muted-foreground">Aucune compétence renseignée</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 bg-background px-3 py-2 text-left font-medium">Membre</th>
            <th className="px-3 py-2 text-left font-medium">Pôle</th>
            {allSkills.map((s) => (
              <th key={s} className="px-2 py-2 text-center font-medium whitespace-nowrap"><span className="text-xs">{s}</span></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.memberId} className="border-t">
              <td className="sticky left-0 bg-background px-3 py-2 font-medium">{entry.memberName}</td>
              <td className="px-3 py-2 text-muted-foreground text-xs">{POLE_LABELS[entry.pole] || entry.pole}</td>
              {allSkills.map((skillName) => {
                const skill = entry.skills.find((s) => s.name === skillName);
                if (!skill) return <td key={skillName} className="px-2 py-2 text-center"><span className="text-muted-foreground/30">—</span></td>;
                return (
                  <td key={skillName} className="px-2 py-2 text-center">
                    <span
                      className="inline-block rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap"
                      style={{ backgroundColor: `${SKILL_LEVEL_COLORS[skill.level]}20`, color: SKILL_LEVEL_COLORS[skill.level] }}
                      title={`${skill.name}: ${SKILL_LEVEL_LABELS[skill.level]}`}
                    >{SKILL_LEVEL_LABELS[skill.level]}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

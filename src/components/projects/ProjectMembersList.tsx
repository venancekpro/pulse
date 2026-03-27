"use client";

import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types";

export function ProjectMembersList({ project }: { project: Project }) {
  if (project.assignments.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun membre assigné</p>;
  }
  return (
    <ul className="space-y-2 text-sm">
      {project.assignments.map((a) => (
        <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
          <span className="font-medium">{a.member?.name}</span>
          <span className="text-muted-foreground">
            {a.role} · {a.allocation}%
          </span>
          {a.isUrgent && <Badge variant="destructive">Urgent</Badge>}
        </li>
      ))}
    </ul>
  );
}

"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STATUS_LABELS } from "@/lib/constants";
import { DeadlineBadge } from "@/components/projects/DeadlineBadge";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="lumis-interactive-card block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--lumis-accent)]/50"
    >
      <Card className="h-full cursor-pointer hover:border-[var(--lumis-accent)]/25">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-start justify-between gap-2">
            <span>{project.name}</span>
            <span className="text-xs font-normal text-muted-foreground">{project.code}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>{STATUS_LABELS[project.status]}</p>
          <DeadlineBadge deadline={project.deadline} />
        </CardContent>
      </Card>
    </Link>
  );
}

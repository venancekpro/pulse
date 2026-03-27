"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { DeadlineBadge } from "@/components/projects/DeadlineBadge";
import { ModuleManager } from "@/components/projects/ModuleManager";
import { ProjectActions } from "@/components/projects/ProjectActions";
import { ProjectMembersList } from "@/components/projects/ProjectMembersList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils/date-helpers";
import type { Project } from "@/types";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.projectId as string;
  const [project, setProject] = useState<Project | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) return;
      const json = (await res.json()) as { data: Project };
      setProject(json.data);
    })();
  }, [id, version]);

  if (!project) {
    return <p className="text-muted-foreground">Chargement…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <PageHeader
            label="Projet"
            title={project.name}
            description={`${project.code} · ${STATUS_LABELS[project.status]}`}
          />
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <DeadlineBadge deadline={project.deadline} />
          <ProjectActions project={project} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Planning</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Du {formatDate(project.startDate)} au {formatDate(project.deadline)} · Complexité{" "}
          {project.complexity}
        </CardContent>
      </Card>

      {project.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">{project.description}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Équipe projet</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectMembersList
            project={project}
            onChanged={() => setVersion((v) => v + 1)}
          />
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--lumis-text-dim)]">
          Modules
        </h2>
        <ModuleManager modules={project.modules} />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { ProjectForm } from "@/components/projects/ProjectForm";
import type { Project } from "@/types";

export default function EditProjectPage() {
  const params = useParams();
  const id = params.projectId as string;
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) return;
      const json = (await res.json()) as { data: Project };
      setProject(json.data);
    })();
  }, [id]);

  if (!project) return <p className="text-muted-foreground">Chargement…</p>;

  return (
    <div className="space-y-6">
      <PageHeader label="Édition" title={project.name} description="Modifier le projet et ses métadonnées." />
      <PermissionGate permission="EDIT_PROJECT">
        <ProjectForm project={project} />
      </PermissionGate>
    </div>
  );
}

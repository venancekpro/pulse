"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProjects } from "@/hooks/useProjects";
import { usePermissions } from "@/hooks/usePermissions";

export default function ProjectsPage() {
  const { projects, error } = useProjects();
  const { can } = usePermissions();

  if (error || !projects) {
    return <p className="text-muted-foreground">{error ?? "Chargement…"}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader label="Portefeuille" title="Projets" description="Portefeuille applicatif SDIVT." />
        {can("CREATE_PROJECT") && (
          <Link href="/projects/new" className={cn(buttonVariants())}>
            Nouveau projet
          </Link>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}

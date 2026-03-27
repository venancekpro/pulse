"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { useProjects } from "@/hooks/useProjects";
import { GanttChart } from "@/components/timeline/GanttChart";

export default function TimelinePage() {
  const { projects, error } = useProjects();

  if (error || !projects) {
    return <p className="text-muted-foreground">{error ?? "Chargement…"}</p>;
  }

  const rows = projects
    .filter((p) => p.status !== "livre")
    .map((p) => ({
      id: p.id,
      name: p.name,
      code: p.code,
      status: p.status,
      startDate: new Date(p.startDate),
      deadline: new Date(p.deadline),
    }));

  return (
    <div className="space-y-6">
      <PageHeader label="Planning" title="Timeline" description="Projets actifs — échelle relative." />
      <GanttChart projects={rows} />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjects } from "@/hooks/useProjects";
import { useSimulationStore } from "@/stores/simulation-store";
import { GanttChart } from "@/components/timeline/GanttChart";
import { TimelineToolbar } from "@/components/timeline/TimelineToolbar";
import { TimelineLegend } from "@/components/timeline/TimelineLegend";
import { PhantomTimelineBanner } from "@/components/timeline/PhantomTimelineBanner";
import type { ZoomLevel, TimelineFilters } from "@/components/timeline/types";
import type { Project } from "@/types";

export default function TimelinePage() {
  const { projects, error } = useProjects();
  const phantom = useSimulationStore((s) => s.phantomProject);
  const [zoom, setZoom] = useState<ZoomLevel>("month");
  const [filters, setFilters] = useState<TimelineFilters>({
    pole: "all",
    status: "all",
  });
  const [highlightedPole, setHighlightedPole] = useState<string | null>(null);

  const phantomProjectId = phantom ? `phantom-${phantom.scenarioId}` : null;

  const filtered = useMemo(() => {
    if (!projects) return [];
    const list = projects.filter((p) => {
      if (p.status === "livre") return false;
      if (filters.status !== "all" && p.status !== filters.status) return false;
      if (filters.pole !== "all") {
        const hasPole = p.assignments.some(
          (a) => a.member?.pole === filters.pole,
        );
        if (!hasPole) return false;
      }
      return true;
    });

    // Inject phantom project if active
    if (phantom) {
      const phantomProject: Project = {
        id: `phantom-${phantom.scenarioId}`,
        name: phantom.projectData.name,
        code: phantom.projectData.code,
        status: "actif",
        startDate: new Date(phantom.startDate),
        deadline: new Date(phantom.projectData.deadline),
        complexity: phantom.projectData.complexity,
        modules: [],
        assignments: phantom.assignments.map((a) => ({
          id: `phantom-assign-${a.memberId}`,
          memberId: a.memberId,
          projectId: `phantom-${phantom.scenarioId}`,
          role: a.role,
          allocation: a.allocation,
          isUrgent: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      list.push(phantomProject);
    }

    return list;
  }, [projects, filters, phantom]);

  if (error || !projects) {
    return <p className="text-muted-foreground">{error ?? "Chargement…"}</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        label="Planning"
        title="Timeline"
        description="Vue chronologique des projets actifs."
      />
      <PhantomTimelineBanner />
      <TimelineToolbar
        zoom={zoom}
        onZoomChange={setZoom}
        filters={filters}
        onFiltersChange={setFilters}
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Vue chronologique</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden">
          <GanttChart
            projects={filtered}
            zoom={zoom}
            highlightedPole={highlightedPole}
            phantomProjectId={phantomProjectId}
          />
        </CardContent>
        <TimelineLegend
          onPoleHover={setHighlightedPole}
          onPoleLeave={() => setHighlightedPole(null)}
        />
      </Card>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjects } from "@/hooks/useProjects";
import { GanttChart } from "@/components/timeline/GanttChart";
import { TimelineToolbar } from "@/components/timeline/TimelineToolbar";
import { TimelineLegend } from "@/components/timeline/TimelineLegend";
import type { ZoomLevel, TimelineFilters } from "@/components/timeline/types";

export default function TimelinePage() {
  const { projects, error } = useProjects();
  const [zoom, setZoom] = useState<ZoomLevel>("month");
  const [filters, setFilters] = useState<TimelineFilters>({
    pole: "all",
    status: "all",
  });

  const filtered = useMemo(() => {
    if (!projects) return [];
    return projects.filter((p) => {
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
  }, [projects, filters]);

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
          <GanttChart projects={filtered} zoom={zoom} />
        </CardContent>
        <TimelineLegend />
      </Card>
    </div>
  );
}

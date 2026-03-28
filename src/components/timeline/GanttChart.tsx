"use client";

import { useMemo } from "react";
import type { Project } from "@/types";
import type { ZoomLevel } from "./types";
import {
  computeTimelineRange,
  computeColumns,
  computeBarPosition,
  computeTodayPosition,
} from "./timeline-utils";
import { TimelineGrid } from "./TimelineGrid";
import { TimelineBar } from "./TimelineBar";

const ROW_HEIGHT = 48;

interface GanttChartProps {
  projects: Project[];
  zoom: ZoomLevel;
}

export function GanttChart({ projects, zoom }: GanttChartProps) {
  const range = useMemo(
    () => computeTimelineRange(projects, zoom),
    [projects, zoom],
  );
  const columns = useMemo(
    () => computeColumns(range, zoom),
    [range, zoom],
  );
  const todayPercent = useMemo(
    () => computeTodayPosition(range),
    [range],
  );
  const bars = useMemo(
    () =>
      projects.map((p, i) => ({
        project: p,
        ...computeBarPosition(p, range),
        rowIndex: i,
      })),
    [projects, range],
  );

  const gridOffsets = useMemo(() => {
    const offsets: number[] = [];
    let sum = 0;
    for (const col of columns) {
      sum += col.widthPercent;
      offsets.push(sum);
    }
    return offsets;
  }, [columns]);

  const chartHeight = projects.length * ROW_HEIGHT;
  const minWidth = Math.max(columns.length * 120, 600);

  if (projects.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        Aucun projet à afficher
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="relative" style={{ minWidth }}>
        <TimelineGrid
          columns={columns}
          todayPercent={todayPercent}
          height={chartHeight}
        />
        <div className="relative" style={{ height: chartHeight }}>
          {/* Vertical grid lines (behind bars) */}
          {gridOffsets.slice(0, -1).map((offset, i) => (
            <div
              key={`grid-${i}`}
              className="absolute top-0 bottom-0 border-l border-dashed border-border z-0"
              style={{ left: `${offset}%` }}
            />
          ))}

          {/* Today marker line in body */}
          {todayPercent !== null && (
            <div
              className="absolute top-0 bottom-0 z-10"
              style={{ left: `${todayPercent}%` }}
            >
              <div className="w-0.5 h-full bg-red-500 opacity-60" />
            </div>
          )}

          {/* Project bars */}
          {bars.map(({ project, leftPercent, widthPercent, rowIndex }) => (
            <TimelineBar
              key={project.id}
              project={project}
              leftPercent={leftPercent}
              widthPercent={widthPercent}
              rowIndex={rowIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

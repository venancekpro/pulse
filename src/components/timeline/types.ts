import type { ProjectStatus, Pole } from "@/types";

export type ZoomLevel = "month" | "quarter" | "year";

export interface TimelineRange {
  start: Date;
  end: Date;
  totalDays: number;
}

export interface TimelineColumn {
  label: string;
  startDate: Date;
  endDate: Date;
  widthPercent: number;
}

export interface TimelineFilters {
  pole: Pole | "all";
  status: ProjectStatus | "all";
}

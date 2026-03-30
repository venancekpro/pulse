import {
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  addMonths,
  addQuarters,
  addYears,
  eachMonthOfInterval,
  differenceInDays,
  format,
  isWithinInterval,
  getQuarter,
  getYear,
} from "date-fns";
import { fr } from "date-fns/locale";
import type { Project } from "@/types";
import type { ZoomLevel, TimelineRange, TimelineColumn } from "./types";

function toDate(d: Date | string): Date {
  return typeof d === "string" ? new Date(d) : d;
}

export function computeTimelineRange(
  projects: Project[],
  zoom: ZoomLevel,
): TimelineRange {
  if (projects.length === 0) {
    const now = new Date();
    return { start: startOfMonth(now), end: endOfMonth(now), totalDays: 30 };
  }

  const starts = projects.map((p) => toDate(p.startDate).getTime());
  const ends = projects.map((p) => toDate(p.deadline).getTime());
  let min = new Date(Math.min(...starts));
  let max = new Date(Math.max(...ends));

  // Snap to period boundaries + 1 period padding
  if (zoom === "month") {
    min = addMonths(startOfMonth(min), -1);
    max = addMonths(endOfMonth(max), 1);
  } else if (zoom === "quarter") {
    min = addQuarters(startOfQuarter(min), -1);
    max = addQuarters(endOfQuarter(max), 1);
  } else {
    min = addYears(startOfYear(min), -1);
    max = addYears(endOfYear(max), 1);
  }

  return {
    start: min,
    end: max,
    totalDays: Math.max(1, differenceInDays(max, min)),
  };
}

export function computeColumns(
  range: TimelineRange,
  zoom: ZoomLevel,
): TimelineColumn[] {
  const columns: TimelineColumn[] = [];

  if (zoom === "month") {
    const months = eachMonthOfInterval({ start: range.start, end: range.end });
    for (const m of months) {
      const end = endOfMonth(m);
      const clampedEnd = end > range.end ? range.end : end;
      const days = differenceInDays(clampedEnd, m) + 1;
      columns.push({
        label: format(m, "MMM yyyy", { locale: fr }),
        startDate: m,
        endDate: clampedEnd,
        widthPercent: (days / range.totalDays) * 100,
      });
    }
  } else if (zoom === "quarter") {
    let current = startOfQuarter(range.start);
    while (current < range.end) {
      const end = endOfQuarter(current);
      const clampedStart = current < range.start ? range.start : current;
      const clampedEnd = end > range.end ? range.end : end;
      const days = differenceInDays(clampedEnd, clampedStart) + 1;
      const q = getQuarter(current);
      const y = getYear(current);
      columns.push({
        label: `T${q} ${y}`,
        startDate: clampedStart,
        endDate: clampedEnd,
        widthPercent: (days / range.totalDays) * 100,
      });
      current = addQuarters(current, 1);
    }
  } else {
    let current = startOfYear(range.start);
    while (current < range.end) {
      const end = endOfYear(current);
      const clampedStart = current < range.start ? range.start : current;
      const clampedEnd = end > range.end ? range.end : end;
      const days = differenceInDays(clampedEnd, clampedStart) + 1;
      columns.push({
        label: format(current, "yyyy"),
        startDate: clampedStart,
        endDate: clampedEnd,
        widthPercent: (days / range.totalDays) * 100,
      });
      current = addYears(current, 1);
    }
  }

  return columns;
}

export function computeBarPosition(
  project: Project,
  range: TimelineRange,
): { leftPercent: number; widthPercent: number } {
  const start = toDate(project.startDate);
  const end = toDate(project.deadline);
  const leftPercent =
    (differenceInDays(start, range.start) / range.totalDays) * 100;
  const widthPercent =
    (Math.max(1, differenceInDays(end, start)) / range.totalDays) * 100;
  return {
    leftPercent: Math.max(0, leftPercent),
    widthPercent: Math.max(1.5, widthPercent),
  };
}

export function computeTodayPosition(range: TimelineRange): number | null {
  const today = new Date();
  if (isWithinInterval(today, { start: range.start, end: range.end })) {
    return (differenceInDays(today, range.start) / range.totalDays) * 100;
  }
  return null;
}

export function getLeadPole(
  project: Project,
): string | null {
  const lead = project.assignments?.find((a) => a.role === "lead");
  return lead?.member?.pole ?? null;
}

export function getProjectPoles(project: Project): string[] {
  const poles = new Set<string>();
  for (const a of project.assignments ?? []) {
    if (a.member?.pole) poles.add(a.member.pole);
  }
  return Array.from(poles);
}

"use client";

import type { TimelineColumn } from "./types";

interface TimelineGridProps {
  columns: TimelineColumn[];
  todayPercent: number | null;
  height: number;
}

function computeOffsets(columns: TimelineColumn[]): number[] {
  const offsets: number[] = [];
  let sum = 0;
  for (const col of columns) {
    offsets.push(sum);
    sum += col.widthPercent;
  }
  return offsets;
}

export function TimelineGrid({ columns, todayPercent, height }: TimelineGridProps) {
  const offsets = computeOffsets(columns);

  return (
    <>
      {/* Header row */}
      <div className="flex border-b border-border sticky top-0 z-30 bg-card">
        {columns.map((col, i) => (
          <div
            key={i}
            className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground py-2 border-r border-border last:border-r-0"
            style={{ width: `${col.widthPercent}%` }}
          >
            {col.label}
          </div>
        ))}
      </div>

      {/* Vertical grid lines */}
      {offsets.slice(1).map((offset, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0 border-l border-dashed border-border z-0"
          style={{ left: `${offset}%`, height }}
        />
      ))}

      {/* Today marker */}
      {todayPercent !== null && (
        <div
          className="absolute top-0 z-10"
          style={{ left: `${todayPercent}%`, height }}
        >
          <div className="w-0.5 h-full bg-red-500" />
          <span className="absolute -top-5 -translate-x-1/2 text-[10px] font-semibold text-red-500 whitespace-nowrap">
            Aujourd&apos;hui
          </span>
        </div>
      )}
    </>
  );
}

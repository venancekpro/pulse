"use client";

import { differenceInDays } from "date-fns";
import { POLE_COLORS } from "@/lib/constants";
import type { Pole } from "@/types";

export function ProjectBar({
  project,
  start,
  end,
}: {
  project: { id: string; name: string; code: string };
  start: Date;
  end: Date;
  pole?: Pole;
}) {
  const total = Math.max(1, differenceInDays(end, start));
  return (
    <div
      className="absolute h-8 rounded-md text-xs flex items-center px-2 text-white font-medium truncate shadow-sm"
      style={{
         left: "0%",
        width: "100%",
        backgroundColor: POLE_COLORS[project.code] ?? "var(--pulse-primary)",
      }}
      title={`${project.name}`}
    >
      {project.code}
    </div>
  );
}

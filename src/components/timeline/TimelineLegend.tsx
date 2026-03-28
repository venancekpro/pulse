"use client";

import {
  STATUS_COLORS,
  STATUS_LABELS,
  POLE_COLORS,
  POLE_LABELS,
} from "@/lib/constants";

export function TimelineLegend() {
  return (
    <div className="flex flex-wrap gap-6 px-4 py-3 border-t border-border">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          Statut
        </span>
        {Object.entries(STATUS_COLORS)
          .filter(([k]) => k !== "livre")
          .map(([key, color]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-muted-foreground">
                {STATUS_LABELS[key] ?? key}
              </span>
            </div>
          ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          Pôle (bordure)
        </span>
        {Object.entries(POLE_COLORS).map(([key, color]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className="h-3 w-1 rounded-sm"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-muted-foreground">
              {POLE_LABELS[key] ?? key}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

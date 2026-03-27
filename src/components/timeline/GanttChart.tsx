"use client";

import { differenceInDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STATUS_LABELS } from "@/lib/constants";

type Row = {
  id: string;
  name: string;
  code: string;
  status: string;
  startDate: Date;
  deadline: Date;
};

export function GanttChart({ projects }: { projects: Row[] }) {
  if (projects.length === 0) return <p className="text-sm text-muted-foreground">Aucun projet</p>;

  const starts = projects.map((p) => new Date(p.startDate).getTime());
  const ends = projects.map((p) => new Date(p.deadline).getTime());
  const min = Math.min(...starts);
  const max = Math.max(...ends);
  const span = Math.max(1, differenceInDays(new Date(max), new Date(min)));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Vue chronologique</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-x-auto">
        {projects.map((p) => {
          const s = new Date(p.startDate);
          const e = new Date(p.deadline);
          const left = (differenceInDays(s, new Date(min)) / span) * 100;
          const width = (Math.max(1, differenceInDays(e, s)) / span) * 100;
          return (
            <div key={p.id} className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground truncate pr-2">
                  {p.name} · {STATUS_LABELS[p.status] ?? p.status}
                </span>
                <span className="shrink-0">{p.code}</span>
              </div>
              <div className="relative h-3 rounded-full bg-muted">
                <div
                  className="absolute top-0 h-3 rounded-full bg-[var(--pulse-primary)] opacity-90"
                  style={{ left: `${left}%`, width: `${Math.max(width, 2)}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

"use client";

import type { Project } from "@/types";
import { STATUS_COLORS, STATUS_LABELS, POLE_COLORS, POLE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils/date-helpers";
import { getLeadPole } from "./timeline-utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const ROW_HEIGHT = 48;

interface TimelineBarProps {
  project: Project;
  leftPercent: number;
  widthPercent: number;
  rowIndex: number;
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "urgent":
      return "destructive" as const;
    case "en-attente":
      return "secondary" as const;
    default:
      return "default" as const;
  }
}

export function TimelineBar({
  project,
  leftPercent,
  widthPercent,
  rowIndex,
}: TimelineBarProps) {
  const leadPole = getLeadPole(project);
  const statusColor = STATUS_COLORS[project.status] ?? "#6B7280";
  const poleColor = leadPole ? POLE_COLORS[leadPole] : undefined;

  const doneCount = project.modules?.filter((m) => m.status === "done").length ?? 0;
  const totalCount = project.modules?.length ?? 0;
  const progressPercent = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

  return (
    <Popover>
      <PopoverTrigger
        className="absolute z-20 cursor-pointer rounded-md text-xs text-white font-medium truncate flex items-center gap-1.5 px-2 shadow-sm transition-all hover:brightness-110 hover:shadow-md"
        style={{
          top: rowIndex * ROW_HEIGHT + 8,
          left: `${leftPercent}%`,
          width: `${widthPercent}%`,
          height: 32,
          backgroundColor: statusColor,
          opacity: 0.9,
          borderLeft: `4px solid ${poleColor ?? "var(--pulse-primary)"}`,
        }}
      >
        <span className="truncate">{project.name}</span>
        <span className="text-white/70 shrink-0">{project.code}</span>
      </PopoverTrigger>

      <PopoverContent side="bottom" sideOffset={8} className="w-80">
        <PopoverHeader>
          <PopoverTitle>{project.name}</PopoverTitle>
          <PopoverDescription>{project.code}</PopoverDescription>
        </PopoverHeader>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Début : {formatDate(project.startDate)}</span>
          <span>Échéance : {formatDate(project.deadline)}</span>
        </div>

        <Badge variant={getStatusBadgeVariant(project.status)}>
          {STATUS_LABELS[project.status] ?? project.status}
        </Badge>

        {/* Module progress */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">
            {totalCount > 0
              ? `Modules : ${doneCount}/${totalCount} terminés`
              : "Aucun module"}
          </p>
          {totalCount > 0 && <Progress value={progressPercent} />}
        </div>

        {/* Assigned members */}
        {project.assignments && project.assignments.length > 0 ? (
          <div className="space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Équipe
            </p>
            {project.assignments.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-foreground">{a.member?.name ?? "—"}</span>
                <div className="flex gap-1.5">
                  <Badge variant="outline">{a.role}</Badge>
                  {a.member?.pole && (
                    <Badge
                      variant="secondary"
                      style={{
                        borderLeft: `3px solid ${POLE_COLORS[a.member.pole] ?? "transparent"}`,
                      }}
                    >
                      {POLE_LABELS[a.member.pole] ?? a.member.pole}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Aucune affectation</p>
        )}
      </PopoverContent>
    </Popover>
  );
}

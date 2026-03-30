"use client";

import type { Project } from "@/types";
import { STATUS_COLORS, STATUS_LABELS, POLE_COLORS, POLE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils/date-helpers";
import { getProjectPoles } from "./timeline-utils";
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
  highlightedPole?: string | null;
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
  highlightedPole,
}: TimelineBarProps) {
  const poles = getProjectPoles(project);
  const statusColor = STATUS_COLORS[project.status] ?? "#6B7280";

  const doneCount = project.modules?.filter((m) => m.status === "done").length ?? 0;
  const totalCount = project.modules?.length ?? 0;
  const progressPercent = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

  const isDimmed = highlightedPole ? !poles.includes(highlightedPole) : false;

  // Texte sombre sur fond clair, blanc sur fond foncé
  const isLightBg = (() => {
    const hex = statusColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 160;
  })();
  const textColor = isLightBg ? "#1e293b" : "#ffffff";

  return (
    <Popover>
      <PopoverTrigger
        className="absolute z-20 cursor-pointer rounded-md text-xs font-medium flex items-center gap-1 shadow-sm hover:brightness-110 hover:shadow-md"
        style={{
          top: rowIndex * ROW_HEIGHT + 8,
          left: `${leftPercent}%`,
          width: `${widthPercent}%`,
          height: 32,
          backgroundColor: statusColor,
          color: textColor,
          opacity: isDimmed ? 0.2 : 0.9,
          transition: "opacity 0.2s ease",
          paddingLeft: poles.length > 0 ? 20 : 8,
          paddingRight: 6,
          overflow: "hidden",
          border: isLightBg ? "1px solid #e2e8f0" : "none",
        }}
      >
        {/* DNA Stripe — bande segmentée multi-pôle */}
        {poles.length > 0 && (
          <div
            className="absolute left-0 top-0 bottom-0 rounded-l-md overflow-hidden"
            style={{ width: 6 }}
          >
            {poles.map((pole, i) => (
              <div
                key={pole}
                style={{
                  position: "absolute",
                  top: `${(i / poles.length) * 100}%`,
                  height: `${100 / poles.length}%`,
                  width: "100%",
                  backgroundColor: POLE_COLORS[pole] ?? "#6B7280",
                }}
              />
            ))}
          </div>
        )}

        <span className="truncate">{project.name}</span>
        <span className="shrink-0 text-[10px]" style={{ color: isLightBg ? "#64748b" : "rgba(255,255,255,0.7)" }}>{project.code}</span>

        {/* Pole Chips — pastilles colorées par pôle */}
        {poles.length > 0 && (
          <div className="flex items-center gap-0.5 shrink-0 ml-auto">
            {poles.map((pole) => (
              <span
                key={pole}
                className="rounded-full shrink-0"
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: POLE_COLORS[pole] ?? "#6B7280",
                  border: "1px solid rgba(255,255,255,0.5)",
                }}
                title={POLE_LABELS[pole] ?? pole}
              />
            ))}
          </div>
        )}
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

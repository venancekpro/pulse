"use client";
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, addMonths, subMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEAVE_TYPE_COLORS, LEAVE_TYPE_LABELS } from "@/lib/constants";
import type { Leave } from "@/types";

interface LeaveCalendarProps {
  leaves: Leave[];
}

export function LeaveCalendar({ leaves }: LeaveCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDay = monthStart.getDay();
  const paddingDays = startDay === 0 ? 6 : startDay - 1;

  function getLeaveForDay(day: Date): Leave | undefined {
    return leaves.find((l) => {
      const start = new Date(l.startDate);
      const end = new Date(l.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      const d = new Date(day);
      d.setHours(0, 0, 0, 0);
      return d >= start && d <= end;
    });
  }

  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: fr })}
        </span>
        <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((name) => (
          <div key={name} className="text-center text-xs text-muted-foreground font-medium py-1">{name}</div>
        ))}
        {Array.from({ length: paddingDays }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {days.map((day) => {
          const leave = getLeaveForDay(day);
          const today = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={`text-center text-xs py-1.5 rounded ${today ? "ring-1 ring-primary" : ""}`}
              style={leave ? { backgroundColor: `${LEAVE_TYPE_COLORS[leave.type]}20`, color: LEAVE_TYPE_COLORS[leave.type] } : {}}
              title={leave ? `${LEAVE_TYPE_LABELS[leave.type]}${leave.description ? ` — ${leave.description}` : ""}` : undefined}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 pt-2">
        {Object.entries(LEAVE_TYPE_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: LEAVE_TYPE_COLORS[key] }} />
            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

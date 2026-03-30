"use client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEAVE_TYPE_LABELS, LEAVE_TYPE_COLORS } from "@/lib/constants";
import { toast } from "sonner";
import type { Leave } from "@/types";

interface LeaveListProps {
  memberId: string;
  leaves: Leave[];
  onChanged: () => void;
  canEdit: boolean;
}

export function LeaveList({ memberId, leaves, onChanged, canEdit }: LeaveListProps) {
  const now = new Date();
  const upcoming = leaves.filter((l) => new Date(l.endDate) >= now);

  async function handleDelete(leaveId: string) {
    try {
      const res = await fetch(`/api/members/${memberId}/leaves/${leaveId}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) { toast.error(json.error || "Erreur"); return; }
      toast.success("Absence supprimée");
      onChanged();
    } catch { toast.error("Erreur réseau"); }
  }

  if (upcoming.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune absence prévue</p>;
  }

  return (
    <ul className="space-y-2">
      {upcoming.map((leave) => (
        <li key={leave.id} className="flex items-center justify-between rounded-md border px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: LEAVE_TYPE_COLORS[leave.type] }} />
            <span className="text-sm font-medium">{LEAVE_TYPE_LABELS[leave.type]}</span>
            <span className="text-sm text-muted-foreground">
              {format(new Date(leave.startDate), "d MMM", { locale: fr })} — {format(new Date(leave.endDate), "d MMM yyyy", { locale: fr })}
            </span>
            {leave.description && <span className="text-xs text-muted-foreground">({leave.description})</span>}
          </div>
          {canEdit && (
            <Button variant="ghost" size="sm" onClick={() => handleDelete(leave.id)}>
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}

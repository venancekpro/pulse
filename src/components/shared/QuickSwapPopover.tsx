"use client";
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";
import { LOAD_COLORS } from "@/lib/constants";
import type { QuickSwapCandidate, MemberWithLoad, Assignment } from "@/types";

interface QuickSwapPopoverProps {
  member: MemberWithLoad;
  assignments?: Assignment[];
  onSwapped?: () => void;
  children: React.ReactNode;
}

export function QuickSwapPopover({ member, assignments, onSwapped, children }: QuickSwapPopoverProps) {
  const [open, setOpen] = useState(false);
  const [candidates, setCandidates] = useState<QuickSwapCandidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string>("");
  const [swapping, setSwapping] = useState<string | null>(null);

  const memberAssignments = assignments || member.assignments || [];
  const isOverloaded = member.loadLevel === "elevee" || member.loadLevel === "critique";

  if (!isOverloaded || memberAssignments.length === 0) return <>{children}</>;

  async function fetchCandidates(assignmentId?: string) {
    setLoading(true);
    try {
      const url = assignmentId
        ? `/api/members/${member.id}/quick-swap?assignmentId=${assignmentId}`
        : `/api/members/${member.id}/quick-swap`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) setCandidates(json.data);
    } finally { setLoading(false); }
  }

  async function executeSwap(targetMemberId: string) {
    if (!selectedAssignment) { toast.error("Sélectionnez une affectation"); return; }
    setSwapping(targetMemberId);
    try {
      const res = await fetch(`/api/members/${member.id}/quick-swap/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId: selectedAssignment, targetMemberId }),
      });
      const json = await res.json();
      if (json.success) {
        const d = json.data;
        toast.success(`Transféré de ${d.oldMemberName} à ${d.newMemberName} (${d.projectName})`);
        setOpen(false);
        onSwapped?.();
      } else {
        toast.error(json.error || "Erreur");
      }
    } catch { toast.error("Erreur réseau"); } finally { setSwapping(null); }
  }

  function handleOpen(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen) {
      if (memberAssignments.length === 1) {
        setSelectedAssignment(memberAssignments[0].id);
        fetchCandidates(memberAssignments[0].id);
      } else {
        setCandidates([]);
        setSelectedAssignment("");
      }
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger className="cursor-pointer hover:underline decoration-dotted">
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ArrowRightLeft className="h-4 w-4" />Transfert rapide
          </div>
          {memberAssignments.length > 1 && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Affectation à transférer :</p>
              {memberAssignments.map((a) => (
                <button
                  key={a.id}
                  className={`w-full text-left rounded px-2 py-1 text-xs border ${selectedAssignment === a.id ? "border-primary bg-primary/5" : "border-transparent hover:bg-accent"}`}
                  onClick={() => { setSelectedAssignment(a.id); fetchCandidates(a.id); }}
                >
                  {a.project?.name || a.projectId} — {a.allocation}%
                </button>
              ))}
            </div>
          )}
          {loading && <p className="text-xs text-muted-foreground">Recherche des candidats...</p>}
          {!loading && selectedAssignment && candidates.length === 0 && (
            <p className="text-xs text-muted-foreground">Aucun candidat disponible</p>
          )}
          {!loading && candidates.map((c) => (
            <div key={c.memberId} className="flex items-center justify-between rounded-md border p-2">
              <div>
                <div className="text-sm font-medium">{c.memberName}</div>
                <div className="text-xs text-muted-foreground">
                  Charge: <span style={{ color: LOAD_COLORS[c.loadLevel] }}>{c.currentLoad}%</span>
                  {" → "}
                  <span style={{ color: LOAD_COLORS[c.projectedLevel] }}>{c.projectedLoad}%</span>
                </div>
                {c.availabilityNote && <div className="text-xs text-amber-500">{c.availabilityNote}</div>}
              </div>
              <Button size="sm" variant="outline" disabled={swapping !== null} onClick={() => executeSwap(c.memberId)}>
                {swapping === c.memberId ? "..." : "Transférer"}
              </Button>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

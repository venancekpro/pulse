"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Assignment, Member } from "@/types";

interface ReassignDialogProps {
  assignment: Assignment;
  projectId: string;
  existingMemberIds: string[];
  onReassigned: () => void;
}

export function ReassignDialog({
  assignment,
  projectId,
  existingMemberIds,
  onReassigned,
}: ReassignDialogProps) {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberId, setNewMemberId] = useState("");
  const [allocation, setAllocation] = useState(assignment.allocation);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    void (async () => {
      const res = await fetch("/api/members");
      if (!res.ok) return;
      const json = (await res.json()) as { data?: Member[] };
      setMembers(json.data ?? []);
    })();
  }, [open]);

  const availableMembers = members.filter(
    (m) => !existingMemberIds.includes(m.id),
  );

  async function handleReassign() {
    if (!newMemberId) {
      toast.error("Sélectionnez un membre");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(
        `/api/projects/${projectId}/assignments/${assignment.id}/reassign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newMemberId,
            allocation,
          }),
        },
      );
      const json = (await res.json()) as { success: boolean; message?: string; error?: string };
      if (!res.ok) {
        toast.error(json.error ?? "Erreur lors de la réassignation");
        return;
      }
      toast.success(json.message ?? "Réassignation effectuée");
      setOpen(false);
      setNewMemberId("");
      onReassigned();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-xs" />
        }
      >
        Réassigner
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Réassigner {assignment.member?.name}</DialogTitle>
          <DialogDescription>
            Transférer l&apos;affectation à un autre membre de l&apos;équipe.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Nouveau membre</Label>
            <Select value={newMemberId} onValueChange={(v) => v && setNewMemberId(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un membre…" />
              </SelectTrigger>
              <SelectContent>
                {availableMembers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} ({m.pole})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Allocation (%)</Label>
            <Input
              type="number"
              min={1}
              max={100}
              value={allocation}
              onChange={(e) => setAllocation(Number(e.target.value))}
            />
          </div>
          <Button
            onClick={() => void handleReassign()}
            loading={saving}
            className="w-full"
          >
            {saving ? "Réassignation…" : "Confirmer la réassignation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

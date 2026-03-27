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
import { Plus } from "lucide-react";
import type { Member, AssignmentRole } from "@/types";

interface AddMemberDialogProps {
  projectId: string;
  existingMemberIds: string[];
  onAdded: () => void;
}

export function AddMemberDialog({
  projectId,
  existingMemberIds,
  onAdded,
}: AddMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [memberId, setMemberId] = useState("");
  const [role, setRole] = useState<AssignmentRole>("contributeur");
  const [allocation, setAllocation] = useState(20);
  const [isUrgent, setIsUrgent] = useState(false);
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

  async function handleAdd() {
    if (!memberId) {
      toast.error("Sélectionnez un membre");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, role, allocation, isUrgent }),
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (!res.ok) {
        toast.error(json.error ?? "Erreur lors de l'ajout");
        return;
      }
      toast.success("Membre ajouté au projet");
      setOpen(false);
      setMemberId("");
      setRole("contributeur");
      setAllocation(20);
      setIsUrgent(false);
      onAdded();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="mt-3 gap-1.5" />
        }
      >
        <Plus className="size-3.5" />
        Ajouter un membre
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un membre</DialogTitle>
          <DialogDescription>
            Affecter un nouveau membre à ce projet.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Membre</Label>
            <Select value={memberId} onValueChange={(v) => v && setMemberId(v)}>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rôle</Label>
              <Select value={role} onValueChange={(v) => setRole(v as AssignmentRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="contributeur">Contributeur</SelectItem>
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
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isUrgent"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="size-4 rounded border-border"
            />
            <Label htmlFor="isUrgent" className="cursor-pointer">Urgent</Label>
          </div>
          <Button
            onClick={() => void handleAdd()}
            loading={saving}
            className="w-full"
          >
            {saving ? "Ajout…" : "Ajouter au projet"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

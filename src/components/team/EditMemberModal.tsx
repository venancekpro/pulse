"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { LoadLevel, MemberWithLoad } from "@/types";

export function EditMemberModal({
  member,
  onSaved,
}: {
  member: MemberWithLoad;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadLevel, setLoadLevel] = useState<LoadLevel>(member.loadLevel);
  const [isoC, setIsoC] = useState(String(member.isoActions?.completed ?? ""));
  const [isoT, setIsoT] = useState(String(member.isoActions?.total ?? ""));

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/members/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loadLevel,
          isoActionsCompleted: isoC ? Number(isoC) : undefined,
          isoActionsTotal: isoT ? Number(isoT) : undefined,
        }),
      });
      if (!res.ok) {
        toast.error("Échec de la mise à jour");
        return;
      }
      toast.success("Membre mis à jour");
      setOpen(false);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
        Modifier charge / ISO
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Éditer {member.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Niveau de charge (manuel)</Label>
            <Select
              value={loadLevel}
              onValueChange={(v) => v && setLoadLevel(v as LoadLevel)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normale">Normale</SelectItem>
                <SelectItem value="moderee">Modérée</SelectItem>
                <SelectItem value="elevee">Élevée</SelectItem>
                <SelectItem value="critique">Critique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>ISO complétées</Label>
              <Input value={isoC} onChange={(e) => setIsoC(e.target.value)} type="number" />
            </div>
            <div className="space-y-2">
              <Label>ISO total</Label>
              <Input value={isoT} onChange={(e) => setIsoT(e.target.value)} type="number" />
            </div>
          </div>
          <Button onClick={() => void save()} className="w-full" loading={saving}>
            {saving ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

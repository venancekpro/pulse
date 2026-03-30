"use client";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { LEAVE_TYPE_LABELS } from "@/lib/constants";

interface AddLeaveDialogProps {
  memberId: string;
  onAdded: () => void;
}

export function AddLeaveDialog({ memberId, onAdded }: AddLeaveDialogProps) {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("conge");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!startDate || !endDate) { toast.error("Les dates sont requises"); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/members/${memberId}/leaves`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, startDate, endDate, type, description: description || undefined }),
      });
      const json = await res.json();
      if (!json.success) { toast.error(json.error || "Erreur"); return; }
      toast.success("Absence ajoutée");
      setOpen(false);
      setStartDate(""); setEndDate(""); setType("conge"); setDescription("");
      onAdded();
    } catch { toast.error("Erreur réseau"); } finally { setSaving(false); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
        <Plus className="h-4 w-4" />Ajouter une absence
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nouvelle absence</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Date de début</Label><Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>Date de fin</Label><Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => v && setType(String(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(LEAVE_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Description (optionnel)</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Motif..." /></div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={saving}>{saving ? "Enregistrement..." : "Ajouter"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

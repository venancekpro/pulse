"use client";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { X, Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import { PREDEFINED_SKILLS, SKILL_LEVEL_LABELS } from "@/lib/constants";
import type { MemberSkill } from "@/types";

interface EditSkillsDialogProps {
  memberId: string;
  currentSkills: MemberSkill[];
  onSaved: () => void;
}

export function EditSkillsDialog({ memberId, currentSkills, onSaved }: EditSkillsDialogProps) {
  const [open, setOpen] = useState(false);
  const [skills, setSkills] = useState<MemberSkill[]>(currentSkills);
  const [newSkill, setNewSkill] = useState("");
  const [newLevel, setNewLevel] = useState<string>("2");
  const [saving, setSaving] = useState(false);

  function addSkill() {
    if (!newSkill.trim()) return;
    if (skills.some((s) => s.name.toLowerCase() === newSkill.trim().toLowerCase())) {
      toast.error("Compétence déjà ajoutée");
      return;
    }
    setSkills([...skills, { name: newSkill.trim(), level: parseInt(newLevel) as 1 | 2 | 3 }]);
    setNewSkill("");
    setNewLevel("2");
  }

  function removeSkill(index: number) {
    setSkills(skills.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills }),
      });
      const json = await res.json();
      if (!json.success) { toast.error(json.error || "Erreur"); return; }
      toast.success("Compétences mises à jour");
      setOpen(false);
      onSaved();
    } catch { toast.error("Erreur réseau"); } finally { setSaving(false); }
  }

  const suggestions = PREDEFINED_SKILLS.filter(
    (s) => !skills.some((sk) => sk.name.toLowerCase() === s.toLowerCase()) &&
    s.toLowerCase().includes(newSkill.toLowerCase())
  ).slice(0, 5);

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) setSkills(currentSkills); }}>
      <DialogTrigger className="inline-flex items-center justify-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
        <Pencil className="h-3.5 w-3.5" />Modifier
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Compétences</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm">
                {skill.name} ({SKILL_LEVEL_LABELS[skill.level]})
                <button onClick={() => removeSkill(i)} className="ml-1 text-muted-foreground hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {skills.length === 0 && <p className="text-sm text-muted-foreground">Aucune compétence</p>}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Ajouter une compétence..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
              />
              {newSkill && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-md border bg-popover shadow-md">
                  {suggestions.map((s) => (
                    <button key={s} className="block w-full px-3 py-1.5 text-left text-sm hover:bg-accent" onClick={() => setNewSkill(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Select value={newLevel} onValueChange={(v) => v && setNewLevel(String(v))}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">{SKILL_LEVEL_LABELS[1]}</SelectItem>
                <SelectItem value="2">{SKILL_LEVEL_LABELS[2]}</SelectItem>
                <SelectItem value="3">{SKILL_LEVEL_LABELS[3]}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={addSkill}><Plus className="h-4 w-4" /></Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "..." : "Enregistrer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

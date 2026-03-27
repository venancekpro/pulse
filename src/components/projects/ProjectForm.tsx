"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Project } from "@/types";

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const edit = Boolean(project);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(project?.name ?? "");
  const [code, setCode] = useState(project?.code ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [status, setStatus] = useState(project?.status ?? "actif");
  const [complexity, setComplexity] = useState(project?.complexity ?? "moyenne");
  const [startDate, setStartDate] = useState(
    project ? new Date(project.startDate).toISOString().slice(0, 10) : "",
  );
  const [deadline, setDeadline] = useState(
    project ? new Date(project.deadline).toISOString().slice(0, 10) : "",
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const url = edit ? `/api/projects/${project!.id}` : "/api/projects";
      const res = await fetch(url, {
        method: edit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          code,
          description: description || undefined,
          status,
          complexity,
          startDate,
          deadline,
        }),
      });
      const json = (await res.json()) as { data?: { id: string }; error?: string };
      if (!res.ok) {
        toast.error(json.error ?? "Erreur");
        return;
      }
      toast.success(edit ? "Projet mis à jour" : "Projet créé");
      router.push(`/projects/${json.data?.id ?? project?.id}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      <div className="space-y-2">
        <Label>Nom</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label>Code</Label>
        <Input value={code} onChange={(e) => setCode(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Statut</Label>
          <Select
            value={status}
            onValueChange={(v) => v && setStatus(v as typeof status)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="actif">Actif</SelectItem>
              <SelectItem value="livre">Livré</SelectItem>
              <SelectItem value="en-attente">En attente</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Complexité</Label>
          <Select
            value={complexity}
            onValueChange={(v) => v && setComplexity(v as typeof complexity)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="faible">Faible</SelectItem>
              <SelectItem value="moyenne">Moyenne</SelectItem>
              <SelectItem value="haute">Haute</SelectItem>
              <SelectItem value="critique">Critique</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Début</Label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Échéance</Label>
          <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
        </div>
      </div>
      <Button type="submit" loading={loading}>
        {loading ? "Enregistrement…" : edit ? "Mettre à jour" : "Créer le projet"}
      </Button>
    </form>
  );
}

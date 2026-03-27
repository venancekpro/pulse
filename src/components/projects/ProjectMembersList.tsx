"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { ReassignDialog } from "@/components/projects/ReassignDialog";
import { AddMemberDialog } from "@/components/projects/AddMemberDialog";
import { Trash2 } from "lucide-react";
import type { Project } from "@/types";

interface ProjectMembersListProps {
  project: Project;
  onChanged?: () => void;
}

export function ProjectMembersList({ project, onChanged }: ProjectMembersListProps) {
  const [removingId, setRemovingId] = useState<string | null>(null);
  const existingMemberIds = project.assignments.map((a) => a.memberId);

  async function removeAssignment(assignmentId: string) {
    if (!confirm("Retirer ce membre du projet ?")) return;
    setRemovingId(assignmentId);
    try {
      const res = await fetch(
        `/api/projects/${project.id}/assignments/${assignmentId}`,
        { method: "DELETE" },
      );
      const json = (await res.json()) as { success: boolean; error?: string };
      if (!res.ok) {
        toast.error(json.error ?? "Erreur");
        return;
      }
      toast.success("Membre retiré du projet");
      onChanged?.();
    } finally {
      setRemovingId(null);
    }
  }

  if (project.assignments.length === 0) {
    return (
      <div>
        <p className="text-sm text-muted-foreground">Aucun membre assigné</p>
        <PermissionGate permission="ASSIGN_MEMBERS">
          <AddMemberDialog
            projectId={project.id}
            existingMemberIds={existingMemberIds}
            onAdded={() => onChanged?.()}
          />
        </PermissionGate>
      </div>
    );
  }

  return (
    <div>
      <ul className="space-y-2 text-sm">
        {project.assignments.map((a) => (
          <li
            key={a.id}
            className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{a.member?.name}</span>
              <span className="text-muted-foreground">
                {a.role} · {a.allocation}%
              </span>
              {a.isUrgent && <Badge variant="destructive">Urgent</Badge>}
            </div>
            <PermissionGate permission="ASSIGN_MEMBERS">
              <div className="flex items-center gap-1">
                <ReassignDialog
                  assignment={a}
                  projectId={project.id}
                  existingMemberIds={existingMemberIds}
                  onReassigned={() => onChanged?.()}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto px-2 py-1 text-xs text-destructive hover:text-destructive"
                  onClick={() => void removeAssignment(a.id)}
                  disabled={removingId === a.id}
                >
                  <Trash2 className="mr-1 size-3" />
                  {removingId === a.id ? "…" : "Retirer"}
                </Button>
              </div>
            </PermissionGate>
          </li>
        ))}
      </ul>
      <PermissionGate permission="ASSIGN_MEMBERS">
        <AddMemberDialog
          projectId={project.id}
          existingMemberIds={existingMemberIds}
          onAdded={() => onChanged?.()}
        />
      </PermissionGate>
    </div>
  );
}

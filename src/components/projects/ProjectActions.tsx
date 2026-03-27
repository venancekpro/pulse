"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PermissionGate } from "@/components/auth/PermissionGate";
import type { Project } from "@/types";

export function ProjectActions({ project }: { project: Project }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function remove() {
    if (!confirm("Supprimer ce projet ?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Suppression impossible");
        return;
      }
      toast.success("Projet supprimé");
      router.push("/projects");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <PermissionGate permission="EDIT_PROJECT">
        <Link
          href={`/projects/${project.id}/edit`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Modifier
        </Link>
      </PermissionGate>
      <PermissionGate permission="DELETE_PROJECT">
        <Button variant="destructive" size="sm" loading={deleting} onClick={() => void remove()}>
          {deleting ? "Suppression…" : "Supprimer"}
        </Button>
      </PermissionGate>
    </div>
  );
}

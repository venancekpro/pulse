"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { ProjectForm } from "@/components/projects/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        label="Création"
        title="Nouveau projet"
        description="Création réservée aux administrateurs."
      />
      <PermissionGate permission="CREATE_PROJECT">
        <ProjectForm />
      </PermissionGate>
    </div>
  );
}

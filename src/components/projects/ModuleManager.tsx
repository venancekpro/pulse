"use client";

import { ModuleCard } from "@/components/projects/ModuleCard";
import type { Module } from "@/types";

export function ModuleManager({ modules }: { modules: Module[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {modules.map((m) => (
        <ModuleCard key={m.id} mod={m} />
      ))}
    </div>
  );
}

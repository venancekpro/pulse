"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_MODULES } from "@/lib/constants";
import type { SimulatorModule } from "@/types";

interface ModuleEditorProps {
  modules: SimulatorModule[];
  onChange: (modules: SimulatorModule[]) => void;
}

export function ModuleEditor({ modules, onChange }: ModuleEditorProps) {
  function addEmpty() {
    onChange([
      ...modules,
      { id: crypto.randomUUID(), name: "", estimatedDays: 1 },
    ]);
  }

  function addDefaults() {
    const existing = new Set(modules.map((m) => m.name.toLowerCase()));
    const toAdd = DEFAULT_MODULES.filter(
      (d) => !existing.has(d.name.toLowerCase()),
    ).map((d) => ({
      id: crypto.randomUUID(),
      name: d.name,
      estimatedDays: d.estimatedDays,
    }));
    onChange([...modules, ...toAdd]);
  }

  function remove(id: string) {
    onChange(modules.filter((m) => m.id !== id));
  }

  function update(id: string, patch: Partial<SimulatorModule>) {
    onChange(modules.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Modules du projet</h3>
      <div className="space-y-2">
        {modules.map((mod) => (
          <div key={mod.id} className="flex items-center gap-2">
            <Input
              placeholder="Nom du module"
              value={mod.name}
              onChange={(e) => update(mod.id, { name: e.target.value })}
              className="flex-1 h-8"
            />
            <Input
              type="number"
              min={1}
              value={mod.estimatedDays}
              onChange={(e) =>
                update(mod.id, {
                  estimatedDays: Math.max(1, Number(e.target.value) || 1),
                })
              }
              className="w-20 h-8 text-center"
            />
            <span className="text-xs text-muted-foreground shrink-0">jours</span>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              onClick={() => remove(mod.id)}
            >
              <X className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <Button variant="outline" size="sm" onClick={addEmpty}>
          <Plus className="size-3.5 mr-1.5" />
          Ajouter un module
        </Button>
        {modules.length === 0 && (
          <Button variant="ghost" size="sm" onClick={addDefaults}>
            Modules par défaut
          </Button>
        )}
      </div>
    </div>
  );
}

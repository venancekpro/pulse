"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Module } from "@/types";

export function ModuleCard({ mod }: { mod: Module }) {
  return (
    <Card>
      <CardContent className="py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <div>
          <p className="font-medium">{mod.name}</p>
          <p className="text-xs text-muted-foreground">
            {mod.completedDays}/{mod.estimatedDays} j · {mod.status}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">{mod.type}</Badge>
          {mod.assignedTo && <Badge variant="secondary">{mod.assignedTo.name}</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}

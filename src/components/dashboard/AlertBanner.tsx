"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import type { MemberWithLoad } from "@/types";

export function AlertBanner({ members }: { members: MemberWithLoad[] }) {
  const critical = members.filter((m) => m.loadLevel === "critique");
  if (critical.length === 0) return null;
  return (
    <Alert variant="destructive" className="border-red-600/50 bg-red-600/5">
      <AlertTriangle className="size-4" />
      <AlertTitle>Charge critique</AlertTitle>
      <AlertDescription>
        {critical.map((m) => m.name).join(", ")} — capacité dépassée, prioriser le lissage ou la
        réaffectation.
      </AlertDescription>
    </Alert>
  );
}

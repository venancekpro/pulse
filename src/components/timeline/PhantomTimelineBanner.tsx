"use client";

import { useRouter } from "next/navigation";
import { Zap, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useSimulationStore } from "@/stores/simulation-store";

export function PhantomTimelineBanner() {
  const router = useRouter();
  const phantom = useSimulationStore((s) => s.phantomProject);
  const clear = useSimulationStore((s) => s.clearPhantom);

  if (!phantom) return null;

  return (
    <Alert className="border-purple-500/30 bg-purple-500/10">
      <Zap className="size-4 text-purple-500" />
      <AlertTitle className="text-purple-600 dark:text-purple-400">
        Projet simulé affiché
      </AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>
          &laquo;&nbsp;{phantom.projectData.name}&nbsp;&raquo; ({phantom.scenarioLabel}) est superposé à la timeline.
        </span>
        <div className="flex gap-2 shrink-0 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/simulator")}
          >
            Voir le scénario
          </Button>
          <Button variant="ghost" size="sm" onClick={clear}>
            <X className="size-3.5 mr-1" />
            Masquer
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}

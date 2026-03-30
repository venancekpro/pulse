import type { ReliabilityScore } from "@/types";

const BIAS_CONFIG = {
  optimiste: { label: "Optimiste", color: "#F59E0B", description: "Tend à sous-estimer" },
  realiste: { label: "Réaliste", color: "#10B981", description: "Estimations fiables" },
  pessimiste: { label: "Pessimiste", color: "#3B82F6", description: "Tend à surestimer" },
};

interface ReliabilityBadgeProps {
  score: ReliabilityScore;
  showDetails?: boolean;
}

export function ReliabilityBadge({ score, showDetails = false }: ReliabilityBadgeProps) {
  const config = BIAS_CONFIG[score.bias];

  if (score.confidence === "faible") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs text-muted-foreground">
        Données insuffisantes
      </span>
    );
  }

  return (
    <div className="inline-flex flex-col gap-0.5">
      <span
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium"
        style={{ backgroundColor: `${config.color}15`, color: config.color }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: config.color }} />
        {config.label} (x{score.correctionFactor})
      </span>
      {showDetails && (
        <span className="text-xs text-muted-foreground pl-1">
          {config.description} — {score.completedModules} modules complétés
        </span>
      )}
    </div>
  );
}

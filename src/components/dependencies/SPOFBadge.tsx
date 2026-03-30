import type { SPOFAlert } from "@/types";

const RISK_CONFIG = {
  medium: { label: "SPOF", color: "#F59E0B" },
  high: { label: "SPOF", color: "#F97316" },
  critical: { label: "SPOF critique", color: "#DC2626" },
};

interface SPOFBadgeProps {
  alert: SPOFAlert;
}

export function SPOFBadge({ alert }: SPOFBadgeProps) {
  const config = RISK_CONFIG[alert.riskLevel];
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${config.color}15`, color: config.color }}
      title={alert.impactMessage}
    >
      {config.label}
    </span>
  );
}

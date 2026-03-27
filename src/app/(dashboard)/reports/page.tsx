"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { ReportGenerator } from "@/components/reports/ReportGenerator";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        label="Exports"
        title="Rapports"
        description="Synthèse charge équipe — export CSV pour les administrateurs."
      />
      <ReportGenerator />
    </div>
  );
}

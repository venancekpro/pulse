"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ReportPreview, type ReportRow } from "@/components/reports/ReportPreview";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions } from "@/hooks/usePermissions";

export function ReportGenerator() {
  const [rows, setRows] = useState<ReportRow[] | null>(null);
  const [exporting, setExporting] = useState(false);
  const { can } = usePermissions();

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/reports/team-load");
      if (!res.ok) return;
      const json = (await res.json()) as { data?: ReportRow[] };
      setRows(json.data ?? []);
    })();
  }, []);

  async function exportCsv() {
    setExporting(true);
    try {
      const res = await fetch("/api/reports/export");
      if (!res.ok) {
        toast.error("Export réservé aux administrateurs");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pulse-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export téléchargé");
    } finally {
      setExporting(false);
    }
  }

  if (!rows) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-32 rounded-lg" />
        <div className="space-y-2 rounded-xl border border-white/[0.06] p-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {can("EXPORT_REPORTS") && (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" loading={exporting} onClick={() => void exportCsv()}>
            {exporting ? "Export…" : "Exporter CSV"}
          </Button>
        </div>
      )}
      <ReportPreview rows={rows} />
    </div>
  );
}

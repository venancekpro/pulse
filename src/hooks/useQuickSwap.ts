"use client";

import { useState, useCallback } from "react";
import type { QuickSwapCandidate, QuickSwapResult } from "@/types";

export function useQuickSwap(memberId: string) {
  const [candidates, setCandidates] = useState<QuickSwapCandidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = useCallback(
    async (assignmentId?: string) => {
      setLoading(true);
      setError(null);
      try {
        const url = assignmentId
          ? `/api/members/${memberId}/quick-swap?assignmentId=${assignmentId}`
          : `/api/members/${memberId}/quick-swap`;
        const res = await fetch(url);
        const json = await res.json();
        if (json.success) {
          setCandidates(json.data);
        } else {
          setError(json.error || "Erreur");
        }
      } catch {
        setError("Erreur réseau");
      } finally {
        setLoading(false);
      }
    },
    [memberId],
  );

  const execute = useCallback(
    async (assignmentId: string, targetMemberId: string): Promise<QuickSwapResult | null> => {
      try {
        const res = await fetch(`/api/members/${memberId}/quick-swap/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assignmentId, targetMemberId }),
        });
        const json = await res.json();
        if (json.success) {
          return json.data as QuickSwapResult;
        }
        setError(json.error || "Erreur");
        return null;
      } catch {
        setError("Erreur réseau");
        return null;
      }
    },
    [memberId],
  );

  return { candidates, loading, error, fetchCandidates, execute };
}

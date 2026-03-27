"use client";

import { useCallback, useEffect, useState } from "react";
import type { MemberWithLoad } from "@/types";

export function useTeamData() {
  const [members, setMembers] = useState<MemberWithLoad[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/members");
      if (!res.ok) throw new Error("Erreur chargement");
      const json = (await res.json()) as { data?: MemberWithLoad[] };
      setMembers(json.data ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { members, error, reload: load };
}

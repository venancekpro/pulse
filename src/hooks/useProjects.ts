"use client";

import { useCallback, useEffect, useState } from "react";
import type { Project } from "@/types";

export function useProjects() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Erreur");
      const json = (await res.json()) as { data?: Project[] };
      setProjects(json.data ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { projects, error, reload: load };
}

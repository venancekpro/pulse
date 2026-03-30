"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { POLE_LABELS } from "@/lib/constants";
import { Lightbulb } from "lucide-react";
import type { CrossPoleSuggestion, Pole } from "@/types";

interface CrossPoleSuggestionsProps {
  pole: Pole;
  requiredSkills: string[];
  excludeMemberIds?: string[];
}

export function CrossPoleSuggestions({ pole, requiredSkills, excludeMemberIds = [] }: CrossPoleSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<CrossPoleSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function loadSuggestions() {
    setLoading(true);
    try {
      const res = await fetch("/api/skills/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pole, requiredSkills, excludeMemberIds }),
      });
      const json = await res.json();
      if (json.success) setSuggestions(json.data);
      setLoaded(true);
    } finally { setLoading(false); }
  }

  if (!loaded) {
    return (
      <Button variant="outline" size="sm" onClick={loadSuggestions} disabled={loading}>
        <Lightbulb className="h-4 w-4 mr-1" />
        {loading ? "Recherche..." : "Suggestions cross-pôle"}
      </Button>
    );
  }

  if (suggestions.length === 0) return <p className="text-sm text-muted-foreground">Aucune suggestion</p>;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium flex items-center gap-1.5">
        <Lightbulb className="h-4 w-4 text-amber-500" />Suggestions cross-pôle
      </h4>
      {suggestions.map((s) => (
        <div key={s.memberId} className="rounded-md border p-3 text-sm">
          <div className="font-medium">{s.memberName} <span className="text-muted-foreground font-normal">({POLE_LABELS[s.pole] || s.pole})</span></div>
          <div className="text-muted-foreground mt-1">{s.reason}</div>
        </div>
      ))}
    </div>
  );
}

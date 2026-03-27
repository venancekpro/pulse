"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Recommendation } from "@/types";

export function RecommendationPanel({ items }: { items: Recommendation[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune recommandation automatique</p>;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recommandations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {items.map((r, i) => (
          <div key={i} className="border-l-2 border-primary pl-3">
            <p className="font-medium">{r.type.replace("_", " ")}</p>
            <p className="text-muted-foreground">{r.reason}</p>
            {r.suggestedAllocation != null && (
              <p className="text-xs mt-1">Allocation suggérée : {r.suggestedAllocation}%</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

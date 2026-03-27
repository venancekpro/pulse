"use client";

import { ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AccessDenied({ message }: { message?: string }) {
  return (
    <Card className="max-w-md mx-auto mt-12">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldAlert className="size-5 text-amber-500" />
          Accès restreint
        </CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        {message ??
          "Cette fonctionnalité est réservée aux administrateurs. Contactez un responsable SDIVT pour obtenir les droits adaptés."}
      </CardContent>
    </Card>
  );
}

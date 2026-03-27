"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_PASSWORD } from "@/lib/constants";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok) {
        toast.error(json.error ?? "Échec de la connexion");
        return;
      }
      toast.success("Bienvenue sur PULSE");
      const from = searchParams.get("from") ?? "/";
      window.location.href = from;
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-[var(--lumis-border)] bg-black/40 shadow-[var(--shadow-lumis-card)] backdrop-blur-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl font-bold tracking-tight text-[var(--lumis-accent)]">
          PULSE
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Plateforme Unifiée de Suivi de charge — SDIVT / CIE
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email professionnel</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="prenom@cie.ci"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" size="lg" loading={loading}>
            {loading ? "Connexion…" : "Se connecter"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Compte test : yacine@cie.ci / {DEFAULT_PASSWORD}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { Spinner } from "@/components/ui/spinner";

export function ShellLoader({ message = "Synchronisation de la session…" }: { message?: string }) {
  return (
    <div className="pulse-loader-screen flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <div className="relative flex size-16 items-center justify-center" aria-hidden>
        <span className="absolute size-14 rounded-full border border-[var(--lumis-accent)]/30" />
        <span className="absolute size-10 rounded-full border border-[var(--lumis-accent)]/50 pulse-loader-ring" />
        <span className="absolute size-6 rounded-full bg-[var(--lumis-accent)]/20 blur-md" />
        <Spinner size="lg" className="relative z-10 text-[var(--lumis-accent)] opacity-100" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-lg font-semibold tracking-tight text-foreground">PULSE</p>
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      </div>
    </div>
  );
}

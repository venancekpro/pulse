import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  return (
    <div className="pulse-loader-screen relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative z-10 w-full max-w-md space-y-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--lumis-accent)]">
          CIE · SDIVT
        </p>
        <Suspense
          fallback={
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--lumis-border)] bg-black/40 py-16 backdrop-blur-xl">
              <Spinner size="lg" className="text-[var(--lumis-accent)] opacity-100" />
              <p className="text-sm text-muted-foreground">Préparation de l’écran…</p>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

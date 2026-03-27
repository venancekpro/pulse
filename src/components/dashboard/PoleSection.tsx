"use client";

import { POLE_LABELS } from "@/lib/constants";
import { MemberCard } from "@/components/dashboard/MemberCard";
import type { MemberWithLoad, Pole } from "@/types";

export function PoleSection({ pole, members }: { pole: Pole; members: MemberWithLoad[] }) {
  if (members.length === 0) return null;
  return (
    <section className="space-y-4">
      <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--lumis-text-dim)]">
        {POLE_LABELS[pole]}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {members.map((m) => (
          <MemberCard key={m.id} member={m} />
        ))}
      </div>
    </section>
  );
}

"use client";

import { Menu } from "lucide-react";
import { LumisIconButton } from "@/components/motion/LumisIconButton";
import { UserMenu } from "@/components/layout/UserMenu";

export function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 border-b border-[var(--lumis-border)] bg-[var(--lumis-card-glass)] px-4 shadow-[var(--shadow-lumis-card)] backdrop-blur-xl transition-all duration-700 ease-out supports-[backdrop-filter]:bg-black/30">
      <LumisIconButton className="lg:hidden" onClick={onMenuClick} aria-label="Ouvrir le menu">
        <Menu className="size-5" />
      </LumisIconButton>
      <div className="flex-1" />
      <UserMenu />
    </header>
  );
}

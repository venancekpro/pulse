"use client";

import { LogOut, User } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/auth/RoleBadge";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  if (!user) return null;
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative inline-flex size-9 items-center justify-center rounded-full border border-[var(--lumis-border)] bg-white/[0.05] outline-none ring-offset-background backdrop-blur-sm transition-all hover:text-white hover:shadow-[var(--shadow-lumis-accent)] focus-visible:ring-2 focus-visible:ring-[var(--lumis-accent)]/40">
        <Avatar className="size-9 ring-1 ring-white/10">
          <AvatarFallback className="bg-sidebar-accent text-[var(--lumis-accent)]">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col gap-1 px-2 py-1.5">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          <RoleBadge role={user.role} />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="gap-2">
          <User className="size-4" />
          Profil
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={loggingOut}
          onClick={() => {
            setLoggingOut(true);
            void logout();
          }}
          className="gap-2 text-destructive"
        >
          {loggingOut ? <Spinner size="sm" /> : <LogOut className="size-4" />}
          {loggingOut ? "Déconnexion…" : "Déconnexion"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

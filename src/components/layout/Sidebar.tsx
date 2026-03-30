"use client";

import {
  BarChart3,
  BookOpen,
  CalendarDays,
  FolderKanban,
  LayoutDashboard,
  Network,
  Settings,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, SETTINGS_NAV } from "@/lib/constants";
import { usePermissions } from "@/hooks/usePermissions";
import { RoleBadge } from "@/components/auth/RoleBadge";
import { useAuth } from "@/hooks/useAuth";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  FolderKanban,
  Zap,
  CalendarDays,
  BookOpen,
  Network,
  BarChart3,
  Settings,
};

export function Sidebar({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const { can } = usePermissions();
  const { user } = useAuth();

  const linkCls = (href: string) => {
    const active = pathname === href || (href !== "/" && pathname.startsWith(href));
    const base =
      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ease-out";
    if (active) {
      return cn(
        base,
        "scale-[1.02] bg-sidebar-accent text-[var(--lumis-accent)] shadow-[var(--shadow-lumis-accent)] ring-1 ring-[var(--lumis-accent-ring)]",
      );
    }
    return cn(
      base,
      "text-sidebar-foreground/75 hover:scale-[1.02] hover:bg-white/[0.06] hover:text-sidebar-foreground",
    );
  };

  return (
    <aside
      className={cn(
        "lumis-sidebar-panel custom-scrollbar flex w-full shrink-0 flex-col overflow-y-auto text-sidebar-foreground backdrop-blur-xl lg:w-64",
        className,
      )}
    >
      <div className="flex h-14 items-center border-b border-sidebar-border/80 px-4">
        <div>
          <p className="bg-gradient-to-r from-[var(--lumis-accent)] to-[var(--kpi-projects)] bg-clip-text text-lg font-bold tracking-tight text-transparent">
            PULSE
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sidebar-foreground/55">
            SDIVT · Charge
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          if (item.adminOnly && !can(item.permission)) return null;
          if (!can(item.permission)) return null;
          const Icon = iconMap[item.icon] ?? LayoutDashboard;
          return (
            <Link key={item.href} href={item.href} className={linkCls(item.href)} onClick={onNavigate}>
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
        {SETTINGS_NAV.adminOnly && can(SETTINGS_NAV.permission) && (
          <Link
            href={SETTINGS_NAV.href}
            className={linkCls(SETTINGS_NAV.href)}
            onClick={onNavigate}
          >
            <Settings className="size-4 shrink-0" />
            {SETTINGS_NAV.label}
          </Link>
        )}
      </nav>
      <div className="space-y-2 border-t border-sidebar-border p-3">
        {user && (
          <div className="space-y-2 rounded-lg border border-[var(--lumis-border)] bg-white/[0.04] px-3 py-2 text-xs backdrop-blur-sm">
            <p className="font-medium truncate">{user.name}</p>
            <RoleBadge role={user.role} />
          </div>
        )}
      </div>
    </aside>
  );
}

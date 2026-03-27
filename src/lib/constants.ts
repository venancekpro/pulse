import type { DefaultModule, LoadLevel, Permission, UserRole } from "@/types";

export const LOAD_THRESHOLDS: Record<LoadLevel, { min: number; max: number }> = {
  normale: { min: 0, max: 60 },
  moderee: { min: 61, max: 80 },
  elevee: { min: 81, max: 100 },
  critique: { min: 101, max: Infinity },
};

export const ROLE_WEIGHT = {
  lead: 1.3,
  contributeur: 1.0,
} as const;

export const TRANSVERSAL_COST: Record<string, number> = {
  "Resp. QSE": 15,
  "Resp. Cloud": 15,
  "Resp. Maintenance": 10,
  "Audit sécu": 10,
  "Google Analytics": 5,
  "Veille techno": 5,
  "Amélioration IA": 5,
  "Serveurs — tous projets": 20,
  "CI/CD — tous projets": 15,
};

export const DEFAULT_MODULES: DefaultModule[] = [
  { name: "Auth", estimatedDays: 3 },
  { name: "User", estimatedDays: 2 },
  { name: "Dashboard", estimatedDays: 4 },
  { name: "API Integration", estimatedDays: 5 },
  { name: "Tests & QA", estimatedDays: 3 },
  { name: "Déploiement", estimatedDays: 2 },
];

export const PERMISSIONS: Record<Permission, UserRole[]> = {
  VIEW_DASHBOARD: ["admin", "viewer"],
  VIEW_TEAM: ["admin", "viewer"],
  VIEW_PROJECTS: ["admin", "viewer"],
  VIEW_TIMELINE: ["admin", "viewer"],
  VIEW_REPORTS: ["admin", "viewer"],
  CREATE_PROJECT: ["admin"],
  EDIT_PROJECT: ["admin"],
  DELETE_PROJECT: ["admin"],
  ASSIGN_MEMBERS: ["admin"],
  USE_SIMULATOR: ["admin"],
  RUN_SIMULATION: ["admin"],
  EDIT_MEMBER_LOAD: ["admin"],
  EXPORT_REPORTS: ["admin"],
  MANAGE_USERS: ["admin"],
};

export const LOAD_COLORS: Record<LoadLevel, string> = {
  critique: "#DC2626",
  elevee: "#F59E0B",
  moderee: "#3B82F6",
  normale: "#10B981",
};

export const POLE_COLORS: Record<string, string> = {
  front: "#8B5CF6",
  back: "#06B6D4",
  devops: "#F97316",
  "ux-ui": "#EC4899",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  admin: "#8B5CF6",
  viewer: "#6B7280",
};

export const LOAD_LABELS: Record<LoadLevel, string> = {
  critique: "Critique",
  elevee: "Élevée",
  moderee: "Modérée",
  normale: "Normale",
};

export const POLE_LABELS: Record<string, string> = {
  front: "Pôle Front",
  back: "Pôle Back",
  devops: "DevOps",
  "ux-ui": "UX/UI",
};

export const STATUS_LABELS: Record<string, string> = {
  actif: "Actif",
  livre: "Livré",
  "en-attente": "En attente",
  urgent: "Urgent",
};

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/",
    icon: "LayoutDashboard" as const,
    permission: "VIEW_DASHBOARD" as Permission,
  },
  {
    label: "Équipe",
    href: "/team",
    icon: "Users" as const,
    permission: "VIEW_TEAM" as Permission,
  },
  {
    label: "Projets",
    href: "/projects",
    icon: "FolderKanban" as const,
    permission: "VIEW_PROJECTS" as Permission,
  },
  {
    label: "Simulateur",
    href: "/simulator",
    icon: "Zap" as const,
    permission: "USE_SIMULATOR" as Permission,
    adminOnly: true,
  },
  {
    label: "Timeline",
    href: "/timeline",
    icon: "CalendarDays" as const,
    permission: "VIEW_TIMELINE" as Permission,
  },
  {
    label: "Rapports",
    href: "/reports",
    icon: "BarChart3" as const,
    permission: "VIEW_REPORTS" as Permission,
  },
];

export const SETTINGS_NAV = {
  label: "Paramètres",
  href: "/settings",
  icon: "Settings" as const,
  permission: "MANAGE_USERS" as Permission,
  adminOnly: true,
};

export const DEFAULT_PASSWORD = "Pulse2024!";

export const COOKIE_NAME = "pulse-token";

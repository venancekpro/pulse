import { PERMISSIONS } from "@/lib/constants";
import type { Permission, UserRole } from "@/types";

export function can(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  return PERMISSIONS[permission].includes(role);
}

export function assertCan(role: UserRole | undefined, permission: Permission): void {
  if (!can(role, permission)) {
    throw new Error("FORBIDDEN");
  }
}

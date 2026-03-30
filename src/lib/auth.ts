import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { JwtPayload, User, UserRole } from "@/types";
import { COOKIE_NAME } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { availabilityFromDb, loadLevelFromDb, poleFromDb } from "@/lib/mappers";

const getSecret = () => {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 16) {
    throw new Error("JWT_SECRET must be set (min 16 characters)");
  }
  return new TextEncoder().encode(s);
};

export async function signSessionToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const sub = String(payload.sub ?? "");
    const email = String(payload.email ?? "");
    const role = payload.role as UserRole;
    const name = String(payload.name ?? "");
    const memberId = payload.memberId ? String(payload.memberId) : undefined;
    if (!sub || !email || !role || !name) return null;
    return { sub, email, role, name, memberId };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<JwtPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  const row = await prisma.user.findUnique({
    where: { id: session.sub },
    include: { member: true },
  });
  if (!row) return null;
  return rowToUser(row);
}

function rowToUser(row: {
  id: string;
  email: string;
  name: string;
  role: string;
  memberId: string | null;
  createdAt: Date;
  updatedAt: Date;
  member: null | {
    id: string;
    name: string;
    pole: string;
    roles: string;
    loadLevel: string;
    transversalRoles: string;
    isoActionsCompleted: number | null;
    isoActionsTotal: number | null;
    availabilityMargin: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}): User {
  const member = row.member
    ? {
        id: row.member.id,
        name: row.member.name,
        pole: poleFromDb(row.member.pole as Parameters<typeof poleFromDb>[0]),
        roles: safeJsonArray(row.member.roles),
        skills: [],
        loadLevel: loadLevelFromDb(row.member.loadLevel),
        transversalRoles: safeJsonArray(row.member.transversalRoles),
        isoActions:
          row.member.isoActionsTotal != null && row.member.isoActionsCompleted != null
            ? {
                completed: row.member.isoActionsCompleted,
                total: row.member.isoActionsTotal,
              }
            : undefined,
        availabilityMargin: availabilityFromDb(row.member.availabilityMargin),
        assignments: [],
        createdAt: row.member.createdAt,
        updatedAt: row.member.updatedAt,
      }
    : undefined;

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role as UserRole,
    memberId: row.memberId ?? undefined,
    member,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function safeJsonArray(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? (v as string[]) : [];
  } catch {
    return [];
  }
}

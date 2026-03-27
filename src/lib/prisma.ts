import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function sqlitePathFromEnv(): string {
  const raw = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  return raw.startsWith("file:") ? raw.slice("file:".length) : raw;
}

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({ url: sqlitePathFromEnv() });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// src/lib/prisma.ts

import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export function getPrisma() {
  if (!globalForPrisma.prisma) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL tanımlı değil")
    }

    // ❌ eskisi: datasources override
    // globalForPrisma.prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

    // ✅ yeni: env variable ile normal init
    globalForPrisma.prisma = new PrismaClient();
  }

  return globalForPrisma.prisma;
}

// Legacy import’lar için named export
export const prisma = getPrisma();
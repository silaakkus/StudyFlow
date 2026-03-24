import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export function getPrisma() {
  if (!globalForPrisma.prisma) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL tanımlı değil")
    }

    globalForPrisma.prisma = new PrismaClient({
      datasources: {
        db: { url: process.env.DATABASE_URL },
      },
    })
  }

  return globalForPrisma.prisma
}

// 🔥 BUNU EKLE (KRİTİK)
export const prisma = getPrisma();
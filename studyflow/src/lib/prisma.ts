// studyflow/lib/prismadb.ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// PrismaClient constructor’da artık datasources yok
function getPrisma() {
  // DATABASE_URL’i environment variable’dan okuyoruz
  const url = process.env.DATABASE_URL
  if (!url) throw new Error("DATABASE_URL is not set")
  return new PrismaClient()
}

// Global caching (Hot-reload sırasında tek instance)
export const prisma = globalForPrisma.prisma ?? getPrisma()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
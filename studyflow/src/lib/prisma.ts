// studyflow/lib/prismadb.ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getPrisma() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error("DATABASE_URL is not set")
  return new PrismaClient({
    datasources: { db: { url } },
  })
}

export const prisma = globalForPrisma.prisma ?? getPrisma()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
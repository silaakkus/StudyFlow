import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const GET = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`

    return NextResponse.json(
      {
        ok: true,
        database: "connected",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        database: "disconnected",
        message: error instanceof Error ? error.message : "Unknown database error",
      },
      { status: 500 }
    )
  }
}

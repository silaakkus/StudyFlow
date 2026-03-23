import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getDemoUser } from "@/lib/demo-user"

export const POST = async (request: Request) => {
  try {
    const user = await getDemoUser()
    const body = (await request.json()) as {
      sessionId?: string
      date?: string
      durationMinutes?: number
    }

    if (!body.sessionId) {
      return NextResponse.json({ ok: false, message: "sessionId zorunlu" }, { status: 400 })
    }

    const data: { date?: Date; durationMinutes?: number } = {}
    if (body.date) data.date = new Date(body.date)
    if (body.durationMinutes && body.durationMinutes > 0) data.durationMinutes = body.durationMinutes

    if (!data.date && !data.durationMinutes) {
      return NextResponse.json({ ok: false, message: "Guncellenecek alan yok" }, { status: 400 })
    }

    await prisma.studySession.updateMany({
      where: {
        id: body.sessionId,
        userId: user.id,
      },
      data,
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Session update error" },
      { status: 500 }
    )
  }
}

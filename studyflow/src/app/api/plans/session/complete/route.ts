import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getDemoUser } from "@/lib/demo-user"

export const POST = async (request: Request) => {
  try {
    const user = await getDemoUser()
    const body = (await request.json()) as { sessionId?: string; completed?: boolean }

    if (!body.sessionId) {
      return NextResponse.json({ ok: false, message: "sessionId zorunlu" }, { status: 400 })
    }

    await prisma.studySession.updateMany({
      where: {
        id: body.sessionId,
        userId: user.id,
      },
      data: {
        isCompleted: body.completed ?? true,
      },
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Session complete update error" },
      { status: 500 }
    )
  }
}

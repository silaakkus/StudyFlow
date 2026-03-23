import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getDemoUser } from "@/lib/demo-user"

const addDays = (date: Date, day: number) => {
  const value = new Date(date)
  value.setDate(value.getDate() + day)
  value.setHours(18, 0, 0, 0)
  return value
}

export const POST = async (request: Request) => {
  try {
    const user = await getDemoUser()
    const body = (await request.json()) as {
      topicId?: string
      confidenceScore?: number
    }

    if (!body.topicId || !body.confidenceScore || body.confidenceScore < 1 || body.confidenceScore > 5) {
      return NextResponse.json(
        { ok: false, message: "topicId ve 1-5 arasi confidenceScore zorunlu" },
        { status: 400 }
      )
    }

    const topic = await prisma.topic.findFirst({
      where: { id: body.topicId, exam: { userId: user.id } },
      include: { exam: true },
    })

    if (!topic) {
      return NextResponse.json({ ok: false, message: "Konu bulunamadi" }, { status: 404 })
    }

    await prisma.topic.update({
      where: { id: topic.id },
      data: { confidenceScore: body.confidenceScore },
    })

    const reminderDays = [1, 7, 30]
    if (body.confidenceScore <= 2) reminderDays.unshift(3)

    const now = new Date()
    await prisma.studySession.createMany({
      data: reminderDays.map((day) => ({
        userId: user.id,
        examId: topic.examId,
        topicId: topic.id,
        date: addDays(now, day),
        durationMinutes: 15,
        isCompleted: false,
      })),
    })

    return NextResponse.json(
      {
        ok: true,
        createdReviewSessions: reminderDays.length,
        reviewDays: reminderDays,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Topic completion error" },
      { status: 500 }
    )
  }
}

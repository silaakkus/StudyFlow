import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getDemoUser } from "@/lib/demo-user"

const startOfDay = (date: Date) => {
  const value = new Date(date)
  value.setHours(0, 0, 0, 0)
  return value
}

export const GET = async () => {
  try {
    const user = await getDemoUser()
    const start = startOfDay(new Date())
    const end = new Date(start)
    end.setDate(end.getDate() + 7)

    const sessions = await prisma.studySession.findMany({
      where: {
        userId: user.id,
        date: { gte: start, lt: end },
      },
      include: {
        exam: { select: { subjectName: true } },
      },
    })

    const byDay = new Map<string, number>()
    const byExam = new Map<string, number>()

    for (const session of sessions) {
      const dayKey = session.date.toISOString().slice(0, 10)
      byDay.set(dayKey, (byDay.get(dayKey) ?? 0) + session.durationMinutes)
      byExam.set(session.exam.subjectName, (byExam.get(session.exam.subjectName) ?? 0) + session.durationMinutes)
    }

    return NextResponse.json(
      {
        ok: true,
        totalMinutes: sessions.reduce((sum, item) => sum + item.durationMinutes, 0),
        daySummary: [...byDay.entries()].map(([day, minutes]) => ({ day, minutes })),
        examSummary: [...byExam.entries()].map(([exam, minutes]) => ({ exam, minutes })),
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Weekly summary error" },
      { status: 500 }
    )
  }
}

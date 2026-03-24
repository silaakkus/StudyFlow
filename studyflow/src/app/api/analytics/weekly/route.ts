export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma" // ✅ getPrisma yerine prisma
import { getDemoUser } from "@/lib/demo-user"

const startOfDay = (date: Date) => {
  const value = new Date(date)
  value.setHours(0, 0, 0, 0)
  return value
}

export const GET = async () => {
  try {
    // const prisma = getPrisma(); // ❌ artık gerek yok, prisma import edildi

    const user = await getDemoUser()
    const today = startOfDay(new Date())
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 6)

    const sessions = await prisma.studySession.findMany({
      where: {
        userId: user.id,
        date: {
          gte: sevenDaysAgo,
          lte: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      include: {
        exam: { select: { subjectName: true } },
      },
    })

    const byDay = new Map<string, number>()
    const byExam = new Map<string, number>()
    let plannedMinutes = 0
    let completedMinutes = 0

    for (const session of sessions) {
      const day = session.date.toISOString().slice(0, 10)
      byDay.set(day, (byDay.get(day) ?? 0) + session.durationMinutes)
      byExam.set(session.exam.subjectName, (byExam.get(session.exam.subjectName) ?? 0) + session.durationMinutes)
      plannedMinutes += session.durationMinutes
      if (session.isCompleted) completedMinutes += session.durationMinutes
    }

    const completionRate =
      plannedMinutes > 0
        ? Number(((completedMinutes / plannedMinutes) * 100).toFixed(1))
        : 0

    return NextResponse.json(
      {
        ok: true,
        weeklyMinutes: [...byDay.entries()].map(([day, minutes]) => ({ day, minutes })),
        subjectDistribution: [...byExam.entries()].map(([subject, minutes]) => ({ subject, minutes })),
        plannedMinutes,
        completedMinutes,
        completionRate,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Weekly analytics error" },
      { status: 500 }
    )
  }
}
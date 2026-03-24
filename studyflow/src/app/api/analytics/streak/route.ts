import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getDemoUser } from "@/lib/demo-user"

// Tarihi günün başlangıcına (00:00) yuvarlayan yardımcı fonksiyon
const toDay = (date: Date) => {
  const value = new Date(date)
  value.setHours(0, 0, 0, 0)
  return value
}

export const GET = async () => {
  try {
    const user = await getDemoUser()
    const completedSessions = await prisma.studySession.findMany({
      where: { userId: user.id, isCompleted: true },
      select: { date: true },
      orderBy: { date: "desc" },
      take: 365,
    })

    // ÇÖZÜM: 'item' parametresine tip tanımlaması eklendi ({ date: Date })
    const uniqueDays = [
      ...new Set(
        completedSessions.map((item: { date: Date }) => 
          toDay(item.date).toISOString().slice(0, 10)
        )
      )
    ]

    let streak = 0
    const cursor = toDay(new Date())

    for (const day of uniqueDays) {
      const cursorKey = cursor.toISOString().slice(0, 10)
      
      if (day === cursorKey) {
        streak += 1
        cursor.setDate(cursor.getDate() - 1)
        continue
      }
      
      // Dün biten bir seri varsa kontrolü
      const yesterdayKey = new Date(cursor.getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      if (streak === 0 && day === yesterdayKey) {
        streak += 1
        cursor.setDate(cursor.getDate() - 2)
        continue
      }
      break
    }

    return NextResponse.json({ ok: true, streak }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Streak analytics error" },
      { status: 500 }
    )
  }
}

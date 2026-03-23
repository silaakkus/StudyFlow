import { NextResponse } from "next/server"
import { google } from "googleapis"
import { prisma } from "@/lib/prisma"
import { getDemoUser } from "@/lib/demo-user"
import { recordMetric } from "@/lib/metrics"

const createDescription = (videoUrl: string | null, durationMinutes: number) => {
  const lines = [
    `Sure: ${durationMinutes} dk`,
    videoUrl ? `Video: ${videoUrl}` : "Video: Ekli degil",
    "Not: StudyFlow tarafindan olusturulan calisma oturumu",
  ]
  return lines.join("\n")
}

const insertCalendarEvent = async (
  calendar: ReturnType<typeof google.calendar>,
  session: {
    date: Date
    durationMinutes: number
    exam: { subjectName: string }
    topic: { title: string } | null
    videoUrl: string | null
  }
) => {
  const start = new Date(session.date)
  const end = new Date(session.date.getTime() + session.durationMinutes * 60 * 1000)

  await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: `StudyFlow | ${session.exam.subjectName} - ${session.topic?.title ?? "Deadline"}`,
      description: createDescription(session.videoUrl, session.durationMinutes),
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
    },
  })
}

export const POST = async (request: Request) => {
  const startedAt = Date.now()
  try {
    const user = await getDemoUser()
    if (user.calendarSyncMode === "NONE") {
      return NextResponse.json(
        {
          ok: false,
          message: "Takvim senkron modu kapali (NONE). Ayarlardan ONE_WAY veya TWO_WAY sec.",
        },
        { status: 400 }
      )
    }
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        provider: "google",
      },
      orderBy: { updatedAt: "desc" },
    })

    if (!account?.access_token) {
      return NextResponse.json(
        {
          ok: false,
          message: "Google access token bulunamadi. Once Google ile giris yap.",
        },
        { status: 400 }
      )
    }

    const body = (await request.json().catch(() => ({}))) as {
      mode?: "bulk" | "single"
      sessionId?: string
    }

    const requestMode = body.mode ?? "bulk"
    const sessions = await prisma.studySession.findMany({
      where: {
        userId: user.id,
        id: requestMode === "single" ? body.sessionId : undefined,
      },
      include: {
        exam: { select: { subjectName: true } },
        topic: { select: { title: true } },
      },
      orderBy: { date: "asc" },
      take: 20,
    })

    const oauth = new google.auth.OAuth2()
    oauth.setCredentials({ access_token: account.access_token })
    const calendar = google.calendar({ version: "v3", auth: oauth })

    let createdCount = 0
    for (const session of sessions) {
      await insertCalendarEvent(calendar, session)
      createdCount += 1
    }

    return NextResponse.json(
      { ok: true, createdCount, mode: user.calendarSyncMode, requestMode },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Google calendar export error" },
      { status: 500 }
    )
  } finally {
    recordMetric("calendar_export", Date.now() - startedAt)
  }
}

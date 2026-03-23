import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getDemoUser } from "@/lib/demo-user"
import { createIcsFile } from "@/lib/ics"

export const GET = async () => {
  try {
    const user = await getDemoUser()
    const sessions = await prisma.studySession.findMany({
      where: { userId: user.id },
      include: {
        exam: { select: { subjectName: true } },
        topic: { select: { title: true } },
      },
      orderBy: { date: "asc" },
      take: 120,
    })

    const ics = createIcsFile(
      sessions.map((session) => {
        const start = new Date(session.date)
        const end = new Date(session.date.getTime() + session.durationMinutes * 60 * 1000)
        return {
          title: `StudyFlow | ${session.exam.subjectName} - ${session.topic?.title ?? "Deadline"}`,
          description: "StudyFlow tarafindan olusturulan calisma oturumu",
          start,
          end,
        }
      })
    )

    return new NextResponse(ics, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": "attachment; filename=studyflow-plan.ics",
      },
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "ICS export error" },
      { status: 500 }
    )
  }
}

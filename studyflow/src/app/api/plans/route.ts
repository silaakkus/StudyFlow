import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getDemoUser } from "@/lib/demo-user"

export const GET = async (request: Request) => {
  try {
    const user = await getDemoUser()
    const { searchParams } = new URL(request.url)
    const examId = searchParams.get("examId")

    const sessions = await prisma.studySession.findMany({
      where: {
        userId: user.id,
        examId: examId || undefined,
      },
      include: {
        exam: {
          select: {
            subjectName: true,
          },
        },
        topic: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { date: "asc" },
      take: 40,
    })

    return NextResponse.json(
      {
        ok: true,
        sessions: sessions.map((session) => ({
          id: session.id,
          examId: session.examId,
          date: session.date.toISOString(),
          durationMinutes: session.durationMinutes,
          breakSuggestionMinutes: 5,
          exam: session.exam.subjectName,
          topic: session.topic?.title ?? "Deadline gorevi",
          isCompleted: session.isCompleted,
          videoUrl: session.videoUrl,
        })),
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown plan list error",
      },
      { status: 500 }
    )
  }
}

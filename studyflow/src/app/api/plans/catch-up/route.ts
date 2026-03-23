import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getDemoUser } from "@/lib/demo-user"
import { generatePlan } from "@/lib/planner"

const startOfToday = () => {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now
}

export const POST = async () => {
  try {
    const user = await getDemoUser()
    const today = startOfToday()

    const pendingToday = await prisma.studySession.findMany({
      where: {
        userId: user.id,
        isCompleted: false,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    })

    const carryTasks = pendingToday.map((session) => ({
      userId: user.id,
      title: `Telafi: ${session.id.slice(0, 6)}`,
      deadlineDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      estimatedHours: Math.max(1, Math.ceil(session.durationMinutes / 60)),
      priority: "HIGH" as const,
      linkedExamId: session.examId,
      isCompleted: false,
    }))

    if (carryTasks.length > 0) {
      await prisma.task.createMany({ data: carryTasks })
    }

    await prisma.studySession.deleteMany({
      where: {
        userId: user.id,
        isCompleted: false,
        date: { gte: today },
      },
    })

    const exams = await prisma.exam.findMany({
      where: { userId: user.id },
      include: { topics: { select: { id: true, title: true } } },
      orderBy: { examDate: "asc" },
    })

    const tasks = await prisma.task.findMany({
      where: { userId: user.id, isCompleted: false },
      orderBy: { deadlineDate: "asc" },
    })

    const newPlan = generatePlan(exams, tasks)
    await prisma.studySession.createMany({
      data: newPlan
        .filter((session) => Boolean(session.examId))
        .map((session) => ({
          userId: user.id,
          examId: session.examId,
          topicId: session.topicId,
          date: session.date,
          durationMinutes: session.durationMinutes,
          videoUrl: null,
          isCompleted: false,
        })),
    })

    return NextResponse.json(
      {
        ok: true,
        carriedSessionCount: pendingToday.length,
        newSessionCount: newPlan.length,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Catch-up mode error" },
      { status: 500 }
    )
  }
}

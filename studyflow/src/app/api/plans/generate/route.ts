import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getDemoUser } from "@/lib/demo-user"
import { generatePlan } from "@/lib/planner"
import { recordMetric } from "@/lib/metrics"

export const POST = async () => {
  const startedAt = Date.now()
  try {
    const user = await getDemoUser()

    const exams = await prisma.exam.findMany({
      where: { userId: user.id },
      include: {
        topics: {
          select: { id: true, title: true },
        },
      },
      orderBy: { examDate: "asc" },
    })

    const tasks = await prisma.task.findMany({
      where: { userId: user.id, isCompleted: false },
      orderBy: { deadlineDate: "asc" },
    })

    if (exams.length === 0) {
      return NextResponse.json({ ok: false, message: "Plan icin en az bir sinav gerekli" }, { status: 400 })
    }

    const plan = generatePlan(exams, tasks)

    const examIds = exams.map((exam) => exam.id)
    await prisma.studySession.deleteMany({
      where: {
        userId: user.id,
        examId: { in: examIds },
        isCompleted: false,
        date: { gte: new Date() },
      },
    })

    await prisma.studySession.createMany({
      data: plan
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
        plannedSessionCount: plan.length,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown plan generation error",
      },
      { status: 500 }
    )
  } finally {
    recordMetric("plan_generate", Date.now() - startedAt)
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getDemoUser } from "@/lib/demo-user"

const ensureDemoData = async () => {
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@studyflow.local" },
    update: {},
    create: {
      email: "demo@studyflow.local",
      name: "Demo User",
    },
  })

  const existingExamCount = await prisma.exam.count({
    where: { userId: demoUser.id },
  })

  if (existingExamCount > 0) return

  const mathExam = await prisma.exam.create({
    data: {
      userId: demoUser.id,
      subjectName: "Matematik",
      examDate: new Date("2026-04-05T09:00:00"),
      priority: "HIGH",
      maxDailyHours: 3,
    },
  })

  const physicsExam = await prisma.exam.create({
    data: {
      userId: demoUser.id,
      subjectName: "Fizik",
      examDate: new Date("2026-04-12T10:30:00"),
      priority: "MEDIUM",
      maxDailyHours: 2,
    },
  })

  await prisma.topic.createMany({
    data: [
      { examId: mathExam.id, title: "Turev" },
      { examId: mathExam.id, title: "Integral" },
      { examId: mathExam.id, title: "Limit" },
      { examId: physicsExam.id, title: "Hareket" },
      { examId: physicsExam.id, title: "Kuvvet" },
    ],
  })
}

export const GET = async () => {
  try {
    await ensureDemoData()

    const exams = await prisma.exam.findMany({
      orderBy: { examDate: "asc" },
      include: {
        topics: {
          select: { id: true },
        },
      },
    })

    type ExamItem = (typeof exams)[number]

    const payload = exams.map((exam: ExamItem) => ({
      id: exam.id,
      subject: exam.subjectName,
      date: exam.examDate.toISOString(),
      topicCount: exam.topics.length,
      priority: exam.priority,
    }))

    return NextResponse.json({ ok: true, exams: payload }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown exam query error",
      },
      { status: 500 }
    )
  }
}

export const POST = async (request: Request) => {
  try {
    const body = (await request.json()) as {
      subject?: string
      examDate?: string
      priority?: "LOW" | "MEDIUM" | "HIGH"
      maxDailyHours?: number
      topics?: string[]
    }

    const subject = body.subject?.trim()
    const examDate = body.examDate?.trim()
    const topics = (body.topics ?? []).map((topic) => topic.trim()).filter(Boolean)

    if (!subject || !examDate) {
      return NextResponse.json(
        { ok: false, message: "subject ve examDate zorunlu" },
        { status: 400 }
      )
    }

    const demoUser = await getDemoUser()

    const createdExam = await prisma.exam.create({
      data: {
        userId: demoUser.id,
        subjectName: subject,
        examDate: new Date(examDate),
        priority: body.priority ?? "MEDIUM",
        maxDailyHours: body.maxDailyHours ?? 2,
      },
    })

    if (topics.length > 0) {
      await prisma.topic.createMany({
        data: topics.map((topic) => ({
          examId: createdExam.id,
          title: topic,
        })),
      })
    }

    return NextResponse.json({ ok: true, examId: createdExam.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown exam create error",
      },
      { status: 500 }
    )
  }
}
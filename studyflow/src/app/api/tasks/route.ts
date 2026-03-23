import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getDemoUser } from "@/lib/demo-user"

export const GET = async () => {
  const user = await getDemoUser()
  const tasks = await prisma.task.findMany({
    where: { userId: user.id },
    orderBy: { deadlineDate: "asc" },
  })

  return NextResponse.json(
    {
      ok: true,
      tasks: tasks.map((task) => ({
        id: task.id,
        title: task.title,
        deadlineDate: task.deadlineDate.toISOString(),
        estimatedHours: task.estimatedHours,
        priority: task.priority,
      })),
    },
    { status: 200 }
  )
}

export const POST = async (request: Request) => {
  try {
    const user = await getDemoUser()
    const body = (await request.json()) as {
      title?: string
      deadlineDate?: string
      estimatedHours?: number
      priority?: "LOW" | "MEDIUM" | "HIGH"
      linkedExamId?: string
    }

    const title = body.title?.trim()
    const deadlineDate = body.deadlineDate?.trim()
    if (!title || !deadlineDate) {
      return NextResponse.json(
        { ok: false, message: "title ve deadlineDate zorunlu" },
        { status: 400 }
      )
    }

    const task = await prisma.task.create({
      data: {
        userId: user.id,
        title,
        deadlineDate: new Date(deadlineDate),
        estimatedHours: body.estimatedHours ?? 1,
        priority: body.priority ?? "MEDIUM",
        linkedExamId: body.linkedExamId ?? null,
      },
    })

    return NextResponse.json({ ok: true, taskId: task.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown task create error",
      },
      { status: 500 }
    )
  }
}

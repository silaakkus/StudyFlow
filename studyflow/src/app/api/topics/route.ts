import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getDemoUser } from "@/lib/demo-user"

export const GET = async () => {
  try {
    const user = await getDemoUser()
    const topics = await prisma.topic.findMany({
      where: { exam: { userId: user.id } },
      include: { exam: { select: { subjectName: true } } },
      orderBy: { updatedAt: "desc" },
      take: 100,
    })

    return NextResponse.json(
      {
        ok: true,
        topics: topics.map((topic) => ({
          id: topic.id,
          title: topic.title,
          exam: topic.exam.subjectName,
          confidenceScore: topic.confidenceScore,
        })),
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Topic list error" },
      { status: 500 }
    )
  }
}

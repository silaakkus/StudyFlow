import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getDemoUser } from "@/lib/demo-user"

type RouteContext = {
  params: Promise<{ id: string }>
}

export const DELETE = async (_request: Request, context: RouteContext) => {
  try {
    const { id } = await context.params
    const user = await getDemoUser()
    await prisma.channel.deleteMany({
      where: {
        id,
        userId: user.id,
      },
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Channel delete error" },
      { status: 500 }
    )
  }
}

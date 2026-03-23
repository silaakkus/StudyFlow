import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getDemoUser } from "@/lib/demo-user"

type SyncMode = "NONE" | "ONE_WAY" | "TWO_WAY"

const validModes: SyncMode[] = ["NONE", "ONE_WAY", "TWO_WAY"]

export const GET = async () => {
  try {
    const user = await getDemoUser()
    return NextResponse.json(
      {
        ok: true,
        mode: user.calendarSyncMode,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Sync mode read error" },
      { status: 500 }
    )
  }
}

export const POST = async (request: Request) => {
  try {
    const user = await getDemoUser()
    const body = (await request.json()) as { mode?: SyncMode }

    if (!body.mode || !validModes.includes(body.mode)) {
      return NextResponse.json({ ok: false, message: "Gecersiz mode degeri" }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { calendarSyncMode: body.mode },
    })

    return NextResponse.json({ ok: true, mode: body.mode }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Sync mode update error" },
      { status: 500 }
    )
  }
}

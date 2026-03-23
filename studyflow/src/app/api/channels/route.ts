import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getDemoUser } from "@/lib/demo-user"

const resolveChannelId = async (raw: string, apiKey: string) => {
  const input = raw.trim()
  const directIdMatch = input.match(/(UC[a-zA-Z0-9_-]{22})/)
  if (directIdMatch?.[1]) return directIdMatch[1]

  const handleMatch = input.match(/youtube\.com\/@([a-zA-Z0-9._-]+)/i)
  const q = handleMatch?.[1] ?? input.replace(/^@/, "")
  if (!q) return null

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=1&q=${encodeURIComponent(q)}&key=${apiKey}`
  const response = await fetch(url, { cache: "no-store" })
  const data = (await response.json()) as {
    items?: Array<{ snippet?: { channelId?: string }; id?: { channelId?: string } }>
  }
  if (!response.ok) return null
  const resolved = data.items?.[0]?.snippet?.channelId ?? data.items?.[0]?.id?.channelId
  return resolved ?? null
}

export const GET = async () => {
  try {
    const user = await getDemoUser()
    const channels = await prisma.channel.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ ok: true, channels }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Channel list error" },
      { status: 500 }
    )
  }
}

export const POST = async (request: Request) => {
  try {
    const user = await getDemoUser()
    const body = (await request.json()) as {
      channelName?: string
      channelId?: string
      channelUrl?: string
    }

    if (!body.channelName?.trim()) {
      return NextResponse.json({ ok: false, message: "channelName zorunlu" }, { status: 400 })
    }

    let resolvedChannelId = body.channelId?.trim() || null
    const apiKey = process.env.YOUTUBE_API_KEY
    if (!resolvedChannelId && apiKey && body.channelName?.trim()) {
      resolvedChannelId = await resolveChannelId(body.channelName, apiKey)
    }

    const channel = await prisma.channel.create({
      data: {
        userId: user.id,
        channelName: body.channelName.trim(),
        channelId: resolvedChannelId,
        channelUrl: body.channelUrl?.trim() || null,
      },
    })

    return NextResponse.json({ ok: true, channel }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Channel create error" },
      { status: 500 }
    )
  }
}

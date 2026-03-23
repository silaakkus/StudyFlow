import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getDemoUser } from "@/lib/demo-user"
import { recordMetric } from "@/lib/metrics"

type YoutubeSearchItem = {
  id: string
  title: string
  channelTitle: string
  thumbnail: string
  videoUrl: string
  publishedAt: string
  durationSeconds: number
  durationText: string
  rankScore: number
}

type YoutubeApiResponse = {
  items?: Array<{
    id: { videoId: string }
    snippet: {
      title: string
      channelTitle: string
      thumbnails?: { medium?: { url?: string } }
      publishedAt: string
    }
  }>
  error?: { message?: string }
}

const cache = new Map<string, { createdAt: number; data: YoutubeSearchItem[] }>()
const staleCache = new Map<string, YoutubeSearchItem[]>()

const getCachedResult = (key: string) => {
  const item = cache.get(key)
  if (!item) return null
  const maxAge = 3 * 60 * 1000
  if (Date.now() - item.createdAt > maxAge) {
    cache.delete(key)
    return null
  }
  return item.data
}

const parseIsoDurationToSeconds = (isoDuration: string) => {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const h = Number(match[1] ?? 0)
  const m = Number(match[2] ?? 0)
  const s = Number(match[3] ?? 0)
  return h * 3600 + m * 60 + s
}

const toDurationText = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  return `${m}:${String(s).padStart(2, "0")}`
}

export const GET = async (request: Request) => {
  const startedAt = Date.now()
  try {
    const { searchParams } = new URL(request.url)
    const topic = searchParams.get("topic")?.trim()
    if (!topic) {
      return NextResponse.json({ ok: false, message: "topic parametresi zorunlu" }, { status: 400 })
    }

    const user = await getDemoUser()
    const channels = await prisma.channel.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    })

    const channelFilter = channels
      .map((channel) => channel.channelId?.trim())
      .filter((value): value is string => Boolean(value))

    const cacheKey = `${topic}:${channelFilter.join(",")}`
    const cached = getCachedResult(cacheKey)
    if (cached) {
      return NextResponse.json(
        {
          ok: true,
          source: "cache",
          elapsedMs: Date.now() - startedAt,
          items: cached,
        },
        { status: 200 }
      )
    }

    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          ok: false,
          message: "YOUTUBE_API_KEY tanimli degil",
          elapsedMs: Date.now() - startedAt,
        },
        { status: 400 }
      )
    }

    const channelQuery = channelFilter.map((id) => `channelId=${encodeURIComponent(id)}`).join("&")
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(topic)}&key=${apiKey}${channelQuery ? `&${channelQuery}` : ""}`

    const response = await fetch(url, { cache: "no-store" })
    const data = (await response.json()) as YoutubeApiResponse
    if (!response.ok) {
      const fallback = staleCache.get(cacheKey)
      if (fallback?.length) {
        return NextResponse.json(
          {
            ok: true,
            source: "fallback_stale_cache",
            message: "YouTube kota/servis hatasi nedeniyle stale cache kullanildi",
            elapsedMs: Date.now() - startedAt,
            items: fallback,
          },
          { status: 200 }
        )
      }
      return NextResponse.json(
        {
          ok: false,
          message: data?.error?.message ?? "YouTube API hatasi",
          elapsedMs: Date.now() - startedAt,
        },
        { status: response.status }
      )
    }

    const videoIds = (data.items ?? []).map((item) => item.id.videoId).filter(Boolean)
    const detailUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${encodeURIComponent(videoIds.join(","))}&key=${apiKey}`
    const detailResponse = await fetch(detailUrl, { cache: "no-store" })
    const detailData = (await detailResponse.json()) as {
      items?: Array<{ id: string; contentDetails?: { duration?: string } }>
    }
    const durationMap = new Map<string, number>()
    for (const item of detailData.items ?? []) {
      const seconds = parseIsoDurationToSeconds(item.contentDetails?.duration ?? "PT0S")
      durationMap.set(item.id, seconds)
    }

    const items: YoutubeSearchItem[] = (data.items ?? []).map((item) => {
      const durationSeconds = durationMap.get(item.id.videoId) ?? 0
      const titleScore = item.snippet.title.toLowerCase().includes(topic.toLowerCase()) ? 40 : 0
      const recencyScore = Math.max(
        0,
        30 - Math.floor((Date.now() - new Date(item.snippet.publishedAt).getTime()) / (1000 * 60 * 60 * 24 * 30))
      )
      const rankScore = titleScore + recencyScore
      return {
      id: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails?.medium?.url || "",
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      publishedAt: item.snippet.publishedAt,
        durationSeconds,
        durationText: toDurationText(durationSeconds),
        rankScore,
      }
    }).sort((a, b) => b.rankScore - a.rankScore)

    cache.set(cacheKey, { createdAt: Date.now(), data: items })
    staleCache.set(cacheKey, items)
    return NextResponse.json(
      {
        ok: true,
        source: "youtube",
        elapsedMs: Date.now() - startedAt,
        whitelistCount: channelFilter.length,
        items,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "YouTube search error",
        elapsedMs: Date.now() - startedAt,
      },
      { status: 500 }
    )
  } finally {
    recordMetric("youtube_search", Date.now() - startedAt)
  }
}

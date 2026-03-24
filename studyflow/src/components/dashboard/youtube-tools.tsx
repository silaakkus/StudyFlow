"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Image from "next/image"

type Channel = {
  id: string
  channelName: string
  channelId: string | null
}

type VideoItem = {
  id: string
  title: string
  channelTitle: string
  thumbnail: string
  videoUrl: string
  durationSeconds?: number
  durationText?: string
  rankScore?: number
}

type SessionOption = {
  id: string
  exam: string
  topic: string
  date: string
  durationMinutes: number
}

export const YoutubeTools = () => {
  const [channels, setChannels] = useState<Channel[]>([])
  const [channelName, setChannelName] = useState("")
  const [channelId, setChannelId] = useState("")
  const [topic, setTopic] = useState("")
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [sessions, setSessions] = useState<SessionOption[]>([])
  const [selectedSessionId, setSelectedSessionId] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [draggingVideoUrl, setDraggingVideoUrl] = useState("")
  const [manualVideoUrl, setManualVideoUrl] = useState("")

  const manualVideoId = useMemo(() => {
    const value = manualVideoUrl.trim()
    if (!value) return ""

    try {
      const url = new URL(value)
      if (url.hostname.includes("youtu.be")) {
        return url.pathname.replace("/", "")
      }

      if (url.hostname.includes("youtube.com")) {
        if (url.pathname.startsWith("/watch")) return url.searchParams.get("v") ?? ""
        if (url.pathname.startsWith("/shorts/")) return url.pathname.split("/")[2] ?? ""
      }
    } catch {
      return ""
    }

    return ""
  }, [manualVideoUrl])

  const loadChannels = async () => {
    const response = await fetch("/api/channels")
    const data = await response.json()
    setChannels(data.channels ?? [])
  }

  useEffect(() => {
    loadChannels()
    fetch("/api/plans")
      .then((response) => response.json())
      .then((data) => {
        const sessionItems = (data.sessions ?? []) as SessionOption[]
        setSessions(sessionItems)
        if (sessionItems[0]?.id) setSelectedSessionId(sessionItems[0].id)
      })
  }, [])

  const handleAddChannel = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage("")
    const response = await fetch("/api/channels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channelName,
        channelId,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      setMessage(data.message ?? "Kanal eklenemedi")
      return
    }

    setChannelName("")
    setChannelId("")
    await loadChannels()
  }

  const handleDeleteChannel = async (id: string) => {
    await fetch(`/api/channels/${id}`, { method: "DELETE" })
    await loadChannels()
  }

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage("")
    try {
      const response = await fetch(`/api/youtube/search?topic=${encodeURIComponent(topic)}`)
      const data = await response.json()
      if (!response.ok) {
        setMessage(data.message ?? "Video arama basarisiz")
        setVideos([])
        return
      }

      setVideos(data.items ?? [])
      setMessage(`${data.elapsedMs} ms icinde ${data.items?.length ?? 0} video bulundu`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAttachVideo = async (videoUrl: string) => {
    if (!selectedSessionId) {
      setMessage("Video baglamak icin once bir seans sec")
      return
    }

    const response = await fetch("/api/plans/attach-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: selectedSessionId, videoUrl }),
    })

    const data = await response.json()
    if (!response.ok) {
      setMessage(data.message ?? "Video seansa baglanamadi")
      return
    }

    const selectedSession = sessions.find((item) => item.id === selectedSessionId)
    const selectedVideo = videos.find((item) => item.videoUrl === videoUrl)
    const videoMinutes = Math.ceil((selectedVideo?.durationSeconds ?? 0) / 60)
    if (selectedSession && videoMinutes > selectedSession.durationMinutes) {
      setMessage(
        `Video eklendi ancak sure asimi var: video ${videoMinutes} dk, seans ${selectedSession.durationMinutes} dk`
      )
      return
    }

    setMessage("Video secili calisma seansina eklendi")
  }

  const handleAttachManualVideo = async () => {
    const trimmedUrl = manualVideoUrl.trim()
    if (!trimmedUrl) {
      setMessage("Once bir YouTube linki gir")
      return
    }

    const isYoutubeUrl =
      trimmedUrl.includes("youtube.com/watch") ||
      trimmedUrl.includes("youtu.be/") ||
      trimmedUrl.includes("youtube.com/shorts/")

    if (!isYoutubeUrl) {
      setMessage("Lutfen gecerli bir YouTube linki gir")
      return
    }

    await handleAttachVideo(trimmedUrl)
    setManualVideoUrl("")
  }

  return (
    <section className="rounded-2xl border border-rose-200 bg-white/90 p-6 shadow-md">
      <h2 className="dashboard-title flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/60 text-sm shadow-sm">
          🎬
        </span>
        YouTube Smart Search
      </h2>
      <p className="mt-1 text-sm text-zinc-600">Beyaz liste kanallari ile konu bazli video onerisi</p>

      <form className="mt-4 grid gap-2 md:grid-cols-3" onSubmit={handleAddChannel}>
        <input
          className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          value={channelName}
          onChange={(event) => setChannelName(event.target.value)}
          placeholder="Kanal adi"
          required
        />
        <input
          className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          value={channelId}
          onChange={(event) => setChannelId(event.target.value)}
          placeholder="Kanal ID (opsiyonel)"
        />
        <button className="rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:from-rose-400 hover:to-orange-400">
          Kanal ekle
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {channels.map((channel) => (
          <button
            key={channel.id}
            type="button"
            onClick={() => handleDeleteChannel(channel.id)}
            className="rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-100"
          >
            {channel.channelName} (sil)
          </button>
        ))}
      </div>

      <form className="mt-4 flex flex-col gap-2 md:flex-row" onSubmit={handleSearch}>
        <input
          className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="Konu ara: Turev"
          required
        />
        <button
          className="rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:from-rose-400 hover:to-fuchsia-400 disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? "Araniyor..." : "Video ara"}
        </button>
      </form>

      <div
        className="mt-3 rounded-xl border border-dashed border-zinc-300 p-3"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          if (draggingVideoUrl) {
            handleAttachVideo(draggingVideoUrl)
            setDraggingVideoUrl("")
          }
        }}
      >
        <p className="text-xs text-zinc-600">Video kartini buraya birakirsan secili seansa eklenir</p>
        <select
          className="mt-2 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          value={selectedSessionId}
          onChange={(event) => setSelectedSessionId(event.target.value)}
        >
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.exam} - {session.topic} ({new Date(session.date).toLocaleString("tr-TR")}) |{" "}
              {session.durationMinutes} dk
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 grid gap-2 rounded-xl border border-zinc-200 p-3 md:grid-cols-[1fr_auto]">
        <input
          className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          value={manualVideoUrl}
          onChange={(event) => setManualVideoUrl(event.target.value)}
          placeholder="YouTube linki yapistir (https://...)"
        />
        <button
          type="button"
          onClick={handleAttachManualVideo}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:from-violet-500 hover:to-fuchsia-500"
        >
          Link ile seansa ekle
        </button>
      </div>

      {manualVideoId ? (
        <article className="mt-3 flex items-center gap-3 rounded-xl border border-zinc-200 bg-white/80 p-3">
          <Image
            src={`https://img.youtube.com/vi/${manualVideoId}/mqdefault.jpg`}
            alt="YouTube video onizleme"
            width={112}
            height={64}
            className="h-16 w-28 rounded-lg object-cover"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-zinc-800">Link onizleme hazir</p>
            <p className="truncate text-xs text-zinc-600">Video ID: {manualVideoId}</p>
          </div>
        </article>
      ) : null}

      {message ? <p className="mt-3 text-sm text-zinc-600">{message}</p> : null}

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {videos.slice(0, 6).map((video) => (
          <article
            key={video.id}
            draggable
            onDragStart={() => setDraggingVideoUrl(video.videoUrl)}
            className="rounded-xl border border-zinc-200 p-3 hover:bg-zinc-50"
          >
            <p className="text-sm font-medium text-zinc-900">{video.title}</p>
            <p className="mt-1 text-xs text-zinc-600">{video.channelTitle}</p>
            <p className="mt-1 text-xs text-zinc-500">
              Sure: {video.durationText ?? "-"} | Skor: {video.rankScore ?? 0}
            </p>
            <div className="mt-2 flex gap-2">
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-zinc-300 px-2 py-1 text-xs text-zinc-700"
              >
                Videoyu ac
              </a>
              <button
                type="button"
                onClick={() => handleAttachVideo(video.videoUrl)}
                className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-2 py-1 text-xs font-semibold text-white"
              >
                Seansa ekle
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

"use client"

import { useEffect, useMemo, useRef, useState } from "react"

type PlanSession = {
  id: string
  date: string
  durationMinutes: number
  exam: string
  topic: string
  isCompleted: boolean
  videoUrl?: string | null
}

const getYoutubeEmbed = (url: string) => {
  const match = url.match(/v=([^&]+)/)
  if (!match?.[1]) return null
  return `https://www.youtube.com/embed/${match[1]}`
}

export const FocusMode = ({ sessions }: { sessions: PlanSession[] }) => {
  const [selectedSessionId, setSelectedSessionId] = useState("")
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [isBreak, setIsBreak] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  const isBreakRef = useRef(isBreak)
  useEffect(() => {
    isBreakRef.current = isBreak
  }, [isBreak])

  useEffect(() => {
    if (!isRunning) return
    const id = window.setInterval(() => {
      setSecondsLeft((previous) => {
        if (previous <= 1) {
          const nextIsBreak = !isBreakRef.current
          setIsBreak(nextIsBreak)
          return nextIsBreak ? 5 * 60 : 25 * 60
        }
        return previous - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [isRunning])

  const activeSessionId = selectedSessionId || sessions[0]?.id || ""
  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId),
    [sessions, activeSessionId]
  )

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0")
  const seconds = String(secondsLeft % 60).padStart(2, "0")
  const embedUrl = selectedSession?.videoUrl ? getYoutubeEmbed(selectedSession.videoUrl) : null

  return (
    <section className="rounded-2xl bg-zinc-900 p-6 text-white shadow-sm">
      <h2 className="text-lg font-semibold">Odak Modu (Pomodoro)</h2>
      <p className="mt-1 text-sm text-zinc-300">25 dk calisma + 5 dk mola dongusu</p>

      <select
        className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm"
        value={activeSessionId}
        onChange={(event) => setSelectedSessionId(event.target.value)}
      >
        {sessions.map((session) => (
          <option key={session.id} value={session.id}>
            {session.exam} - {session.topic}
          </option>
        ))}
      </select>

      <div className="mt-4 text-4xl font-bold">
        {minutes}:{seconds}
      </div>
      <p className="mt-1 text-sm text-zinc-300">{isBreak ? "Mola zamani" : "Calisma zamani"}</p>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setIsRunning((value) => !value)}
          className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-900"
        >
          {isRunning ? "Duraklat" : "Baslat"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsRunning(false)
            setIsBreak(false)
            setSecondsLeft(25 * 60)
          }}
          className="rounded-xl border border-zinc-600 px-4 py-2 text-sm"
        >
          Sifirla
        </button>
      </div>

      {embedUrl ? (
        <iframe
          className="mt-4 h-56 w-full rounded-xl border border-zinc-700"
          src={embedUrl}
          title="Focus video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <p className="mt-4 text-sm text-zinc-300">Bu seansa bagli video yok</p>
      )}
    </section>
  )
}

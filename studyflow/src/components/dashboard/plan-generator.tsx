"use client"

import { useState } from "react"
import { FocusMode } from "@/components/dashboard/focus-mode"

type PlanSession = {
  id: string
  examId: string
  date: string
  durationMinutes: number
  breakSuggestionMinutes?: number
  exam: string
  topic: string
  isCompleted: boolean
  videoUrl?: string | null
}

export const PlanGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [message, setMessage] = useState("")
  const [sessions, setSessions] = useState<PlanSession[]>([])
  const [editSessionId, setEditSessionId] = useState("")
  const [editDate, setEditDate] = useState("")
  const [editDuration, setEditDuration] = useState(60)

  const handleLoadSessions = async () => {
    const response = await fetch("/api/plans")
    const data = await response.json()
    setSessions(data.sessions ?? [])
  }

  const handleGeneratePlan = async () => {
    setIsGenerating(true)
    setMessage("")
    try {
      const response = await fetch("/api/plans/generate", {
        method: "POST",
      })
      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message ?? "Plan olusturma hatasi")
        return
      }

      setMessage(`${data.plannedSessionCount} oturum olusturuldu`)
      await handleLoadSessions()
    } catch {
      setMessage("Baglanti hatasi")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleMarkCompleted = async (sessionId: string, completed: boolean) => {
    await fetch("/api/plans/session/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, completed }),
    })
    await handleLoadSessions()
  }

  const handleCatchUp = async () => {
    setIsGenerating(true)
    setMessage("")
    try {
      const response = await fetch("/api/plans/catch-up", { method: "POST" })
      const data = await response.json()
      if (!response.ok) {
        setMessage(data.message ?? "Catch-up islemi basarisiz")
        return
      }
      setMessage(`Catch-up tamamlandi. ${data.carriedSessionCount} seans telafiye tasindi`)
      await handleLoadSessions()
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEditSession = async () => {
    if (!editSessionId) {
      setMessage("Duzenleme icin once bir seans sec")
      return
    }

    const response = await fetch("/api/plans/session/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: editSessionId,
        date: editDate || undefined,
        durationMinutes: editDuration,
      }),
    })
    const data = await response.json()
    if (!response.ok) {
      setMessage(data.message ?? "Seans duzenlenemedi")
      return
    }
    setMessage("Seans duzenlendi")
    await handleLoadSessions()
  }

  return (
    <section className="rounded-2xl border border-indigo-200 bg-white/90 p-6 shadow-md">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="dashboard-title flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/60 text-sm shadow-sm">
              ⚡
            </span>
            Otomatik Plan Uretici
          </h2>
          <p className="text-sm text-zinc-600">
            Sinav onceligi + konu yogunlugu + deadline gorevlerine gore plan olusturur
          </p>
        </div>
        <button
          type="button"
          onClick={handleGeneratePlan}
          disabled={isGenerating}
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60"
        >
          {isGenerating ? "Plan olusturuluyor..." : "Plani olustur"}
        </button>
        <button
          type="button"
          onClick={handleCatchUp}
          disabled={isGenerating}
          className="rounded-xl border border-indigo-300 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-60"
        >
          Bugun yetismedi (Catch-up)
        </button>
      </div>

      {message ? <p className="mt-3 text-sm text-zinc-600">{message}</p> : null}

      <div className="mt-3 grid gap-2 rounded-xl border border-zinc-200 p-3 md:grid-cols-4">
        <select
          className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          value={editSessionId}
          onChange={(event) => setEditSessionId(event.target.value)}
        >
          <option value="">Duzenlenecek seans sec</option>
          {sessions.slice(0, 20).map((session) => (
            <option key={session.id} value={session.id}>
              {session.exam} - {session.topic}
            </option>
          ))}
        </select>
        <input
          className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          type="datetime-local"
          value={editDate}
          onChange={(event) => setEditDate(event.target.value)}
        />
        <input
          className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          type="number"
          min={15}
          step={5}
          value={editDuration}
          onChange={(event) => setEditDuration(Number(event.target.value))}
        />
        <button
          type="button"
          onClick={handleEditSession}
          className="rounded-xl border border-violet-300 px-4 py-2 text-sm text-violet-700 transition hover:bg-violet-50"
        >
          Seansi duzenle
        </button>
      </div>

      {sessions.length > 0 ? (
        <div className="mt-4 grid gap-2">
          {sessions.slice(0, 8).map((session) => (
            <article key={session.id} className="rounded-xl border border-zinc-200 p-3">
              <p className="text-sm font-medium text-zinc-900">
                {session.exam} - {session.topic}
              </p>
              <p className="text-xs text-zinc-600">
                {new Date(session.date).toLocaleString("tr-TR")} | {session.durationMinutes} dk
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Mola onerisi: {session.breakSuggestionMinutes ?? 5} dk
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleMarkCompleted(session.id, true)}
                  className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-2 py-1 text-xs font-semibold text-white"
                >
                  Tamamlandi
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkCompleted(session.id, false)}
                  className="rounded-lg border border-zinc-300 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50"
                >
                  Beklemede
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {sessions.length > 0 ? <div className="mt-4"><FocusMode sessions={sessions} /></div> : null}
    </section>
  )
}

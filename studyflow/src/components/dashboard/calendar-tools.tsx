"use client"

import { useEffect, useState } from "react"

type SessionOption = {
  id: string
  exam: string
  topic: string
  date: string
}

export const CalendarTools = () => {
  const [message, setMessage] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [syncMode, setSyncMode] = useState<"NONE" | "ONE_WAY" | "TWO_WAY">("ONE_WAY")
  const [isModeSaving, setIsModeSaving] = useState(false)
  const [sessions, setSessions] = useState<SessionOption[]>([])
  const [selectedSessionId, setSelectedSessionId] = useState("")

  useEffect(() => {
    fetch("/api/calendar/sync-mode")
      .then((response) => response.json())
      .then((data) => {
        if (data.mode) setSyncMode(data.mode)
      })
    fetch("/api/plans")
      .then((response) => response.json())
      .then((data) => {
        const sessionItems = (data.sessions ?? []) as SessionOption[]
        setSessions(sessionItems)
        if (sessionItems[0]?.id) setSelectedSessionId(sessionItems[0].id)
      })
  }, [])

  const handleSaveSyncMode = async () => {
    setIsModeSaving(true)
    try {
      const response = await fetch("/api/calendar/sync-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: syncMode }),
      })
      const data = await response.json()
      if (!response.ok) {
        setMessage(data.message ?? "Senkron modu kaydedilemedi")
        return
      }
      setMessage(`Senkron modu guncellendi: ${data.mode}`)
    } finally {
      setIsModeSaving(false)
    }
  }

  const handleGoogleExport = async () => {
    setIsExporting(true)
    setMessage("")
    try {
      const response = await fetch("/api/calendar/google/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "bulk" }),
      })
      const data = await response.json()
      if (!response.ok) {
        setMessage(data.message ?? "Google export basarisiz")
        return
      }
      setMessage(`${data.createdCount} etkinlik Google Takvim'e aktarildi`)
    } finally {
      setIsExporting(false)
    }
  }

  const handleSingleExport = async () => {
    if (!selectedSessionId) {
      setMessage("Tekli aktarim icin seans sec")
      return
    }
    setIsExporting(true)
    setMessage("")
    try {
      const response = await fetch("/api/calendar/google/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "single", sessionId: selectedSessionId }),
      })
      const data = await response.json()
      if (!response.ok) {
        setMessage(data.message ?? "Tekli export basarisiz")
        return
      }
      setMessage("Secili seans Google Takvime aktarildi")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <section className="rounded-2xl border border-emerald-200 bg-white/90 p-6 shadow-md">
      <h2 className="dashboard-title flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/60 text-sm shadow-sm">
          📆
        </span>
        Takvim Aktarimi
      </h2>
      <p className="mt-1 text-sm text-zinc-600">Plani ICS olarak indir veya Google Takvime gonder</p>
      <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center">
        <select
          className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          value={syncMode}
          onChange={(event) => setSyncMode(event.target.value as "NONE" | "ONE_WAY" | "TWO_WAY")}
        >
          <option value="NONE">Senkron kapali</option>
          <option value="ONE_WAY">Tek yonlu (StudyFlow - Google)</option>
          <option value="TWO_WAY">Cift yonlu (hazirlik asamasi)</option>
        </select>
        <button
          type="button"
          onClick={handleSaveSyncMode}
          disabled={isModeSaving}
          className="rounded-xl border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 disabled:opacity-60"
        >
          {isModeSaving ? "Kaydediliyor..." : "Modu kaydet"}
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-2 md:flex-row">
        <a
          href="/api/calendar/ics"
          className="rounded-xl border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
        >
          ICS indir
        </a>
        <button
          type="button"
          onClick={handleGoogleExport}
          disabled={isExporting}
          className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:from-emerald-400 hover:to-teal-400 disabled:opacity-60"
        >
          {isExporting ? "Gonderiliyor..." : "Google Takvime aktar"}
        </button>
      </div>
      <div className="mt-3 flex flex-col gap-2 md:flex-row">
        <select
          className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          value={selectedSessionId}
          onChange={(event) => setSelectedSessionId(event.target.value)}
        >
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.exam} - {session.topic} ({new Date(session.date).toLocaleString("tr-TR")})
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleSingleExport}
          disabled={isExporting}
          className="rounded-xl border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 disabled:opacity-60"
        >
          Secili seansi aktar
        </button>
      </div>
      {message ? <p className="mt-3 text-sm text-zinc-600">{message}</p> : null}
    </section>
  )
}

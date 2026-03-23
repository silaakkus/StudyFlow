"use client"

import { useEffect, useMemo, useState } from "react"

type ExamItem = {
  id: string
  subject: string
  date: string
  topicCount: number
}

type SessionItem = {
  id: string
  date: string
  isCompleted: boolean
}

const dayDiff = (dateIso: string) => {
  const now = new Date()
  const target = new Date(dateIso)
  const ms = target.getTime() - now.getTime()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

export const AlertsCenter = () => {
  const [exams, setExams] = useState<ExamItem[]>([])
  const [sessions, setSessions] = useState<SessionItem[]>([])
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    typeof Notification !== "undefined" ? Notification.permission : "default"
  )
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("/api/exams")
      .then((response) => response.json())
      .then((data) => setExams(data.exams ?? []))
    fetch("/api/plans")
      .then((response) => response.json())
      .then((data) => setSessions(data.sessions ?? []))
  }, [])

  useEffect(() => {
    if (permission !== "granted") return

    for (const exam of exams) {
      const days = dayDiff(exam.date)
      if (![7, 3, 1].includes(days)) continue
      const key = `studyflow_exam_alert_${exam.id}_${days}`
      if (localStorage.getItem(key)) continue

      new Notification("StudyFlow Sinav Hatirlatma", {
        body: `${exam.subject} sinavina ${days} gun kaldi`,
      })
      localStorage.setItem(key, "1")
    }
  }, [exams, permission])

  useEffect(() => {
    if (permission !== "granted") return

    const now = Date.now()
    const oneHourLater = now + 60 * 60 * 1000
    for (const session of sessions) {
      const sessionTime = new Date(session.date).getTime()
      if (sessionTime < now || sessionTime > oneHourLater) continue

      const key = `studyflow_session_alert_${session.id}`
      if (localStorage.getItem(key)) continue
      new Notification("StudyFlow Gunluk Oturum", {
        body: "Bir saat icinde planli bir calisma oturumun var",
      })
      localStorage.setItem(key, "1")
    }
  }, [sessions, permission])

  const showCatchUpSuggestion = useMemo(() => {
    const today = new Date()
    const start = new Date(today)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(end.getDate() + 1)

    const todaySessions = sessions.filter((session) => {
      const d = new Date(session.date)
      return d >= start && d < end
    })
    const completedCount = todaySessions.filter((session) => session.isCompleted).length
    return todaySessions.length > 0 && completedCount < todaySessions.length
  }, [sessions])

  const earlyWarning = useMemo(() => {
    const nearest = exams[0]
    if (!nearest) return ""
    const daysLeft = Math.max(1, dayDiff(nearest.date))
    const topicPerDay = nearest.topicCount / daysLeft
    if (topicPerDay > 1.5) return `Erken uyari: ${nearest.subject} icin sure riskli, hizlandirilmis plan onerilir`
    return ""
  }, [exams])

  const handleRequestPermission = async () => {
    if (typeof Notification === "undefined") {
      setMessage("Tarayici bildirim destegi bulunmuyor")
      return
    }
    const result = await Notification.requestPermission()
    setPermission(result)
    setMessage(`Bildirim izni: ${result}`)
  }

  const handleCatchUp = async () => {
    const response = await fetch("/api/plans/catch-up", { method: "POST" })
    const data = await response.json()
    if (!response.ok) {
      setMessage(data.message ?? "Catch-up basarisiz")
      return
    }
    setMessage(`Catch-up tamamlandi, ${data.carriedSessionCount} seans tasindi`)
  }

  return (
    <section className="glass-panel">
      <div className="glass-panel-content">
        <h2 className="dashboard-title flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/60 text-sm shadow-sm">
            🔔
          </span>
          Bildirim ve Akilli Uyarilar
        </h2>
      <div className="mt-3 flex flex-col gap-2 md:flex-row">
        <button
          type="button"
          onClick={handleRequestPermission}
          className="rounded-xl border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
        >
          Bildirim izni ver
        </button>
        <p className="text-sm text-zinc-600">Durum: {permission}</p>
      </div>

      {earlyWarning ? (
        <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          {earlyWarning}
        </div>
      ) : null}

      {showCatchUpSuggestion ? (
        <div className="mt-3 rounded-xl border border-zinc-200 p-3">
          <p className="text-sm text-zinc-700">
            Bugun bazi oturumlar tamamlanmadi. Yarin icin telafi plani olusturulsun mu?
          </p>
          <button
            type="button"
            onClick={handleCatchUp}
            className="mt-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Telafi plani olustur
          </button>
        </div>
      ) : null}

        {message ? <p className="mt-3 text-sm text-zinc-600">{message}</p> : null}
      </div>
    </section>
  )
}

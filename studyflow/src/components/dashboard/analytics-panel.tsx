"use client"

import { useEffect, useState } from "react"

type WeeklyPoint = { day: string; minutes: number }
type SubjectPoint = { subject: string; minutes: number }

type WeeklyPayload = {
  weeklyMinutes: WeeklyPoint[]
  subjectDistribution: SubjectPoint[]
  plannedMinutes: number
  completedMinutes: number
  completionRate: number
}

export const AnalyticsPanel = () => {
  const [weekly, setWeekly] = useState<WeeklyPayload | null>(null)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    fetch("/api/analytics/weekly")
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) setWeekly(data)
      })
    fetch("/api/analytics/streak")
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) setStreak(data.streak)
      })
  }, [])

  const maxDayMinutes = Math.max(...(weekly?.weeklyMinutes.map((item) => item.minutes) ?? [1]))

  return (
    <section className="glass-panel">
      <div className="glass-panel-content">
        <h2 className="dashboard-title flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/60 text-sm shadow-sm">
            📊
          </span>
          Istatistik Paneli
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          Haftalik calisma saati, ders dagilimi, hedef/gerceklesen ve streak ozeti
        </p>

        {!weekly ? <p className="mt-4 text-sm text-zinc-600">Yukleniyor...</p> : null}

        {weekly ? (
          <>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 p-3">
                <p className="text-sm font-medium text-zinc-900">Haftalik toplam</p>
                <p className="mt-1 text-xs text-zinc-600">{Math.round(weekly.completedMinutes / 60)} saat</p>
                <div className="mt-2 grid gap-2">
                  {weekly.weeklyMinutes.map((item) => (
                    <div key={item.day} className="grid gap-1">
                      <p className="text-xs text-zinc-600">{item.day}</p>
                      <div className="h-2 rounded bg-zinc-100">
                        <div
                          className="h-2 rounded bg-zinc-900"
                          style={{ width: `${Math.max(4, (item.minutes / maxDayMinutes) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 p-3">
                <p className="text-sm font-medium text-zinc-900">Ders dagilimi</p>
                <div className="mt-2 grid gap-1">
                  {weekly.subjectDistribution.map((item) => (
                    <p key={item.subject} className="text-xs text-zinc-600">
                      {item.subject}: {Math.round(item.minutes / 60)} saat
                    </p>
                  ))}
                </div>
                <p className="mt-3 text-xs text-zinc-600">
                  Hedef/Gerceklesen: {weekly.completedMinutes}/{weekly.plannedMinutes} dk (%{weekly.completionRate})
                </p>
                <p className="mt-1 text-xs font-medium text-zinc-700">Streak: {streak} gun</p>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}


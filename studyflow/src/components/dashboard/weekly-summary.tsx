"use client"

import { useEffect, useState } from "react"

type WeeklySummary = {
  totalMinutes: number
  daySummary: Array<{ day: string; minutes: number }>
  examSummary: Array<{ exam: string; minutes: number }>
}

export const WeeklySummaryPanel = () => {
  const [summary, setSummary] = useState<WeeklySummary | null>(null)

  useEffect(() => {
    fetch("/api/plans/weekly-summary")
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          setSummary({
            totalMinutes: data.totalMinutes,
            daySummary: data.daySummary ?? [],
            examSummary: data.examSummary ?? [],
          })
        }
      })
  }, [])

  return (
    <section className="glass-panel">
      <div className="glass-panel-content">
        <h2 className="dashboard-title flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/60 text-sm shadow-sm">
            🗓️
          </span>
          Haftalik Ozet ve Plan
        </h2>
        <p className="mt-1 text-sm text-zinc-600">7 gunluk ders-konu-sure dagilimi</p>

        {!summary ? <p className="mt-4 text-sm text-zinc-600">Yukleniyor...</p> : null}
        {summary ? (
          <>
            <p className="mt-3 text-sm text-zinc-700">Toplam: {summary.totalMinutes} dk</p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 p-3">
                <p className="text-sm font-medium text-zinc-900">Gun bazli</p>
                <div className="mt-2 grid gap-1">
                  {summary.daySummary.map((item) => (
                    <p key={item.day} className="text-xs text-zinc-600">
                      {item.day}: {item.minutes} dk
                    </p>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-zinc-200 p-3">
                <p className="text-sm font-medium text-zinc-900">Ders bazli</p>
                <div className="mt-2 grid gap-1">
                  {summary.examSummary.map((item) => (
                    <p key={item.exam} className="text-xs text-zinc-600">
                      {item.exam}: {item.minutes} dk
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}


"use client"

import { useEffect, useState } from "react"

type Metric = {
  name: string
  count: number
  avgMs: number
  maxMs: number
}

export const PerformancePanel = () => {
  const [metrics, setMetrics] = useState<Metric[]>([])

  useEffect(() => {
    fetch("/api/metrics")
      .then((response) => response.json())
      .then((data) => setMetrics(data.metrics ?? []))
  }, [])

  return (
    <section className="glass-panel">
      <div className="glass-panel-content">
        <h2 className="dashboard-title flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/60 text-sm shadow-sm">
            📈
          </span>
          Performans Ozeti
        </h2>
        <p className="mt-1 text-sm text-zinc-600">Kritik API sureleri (ortalama / maksimum)</p>
        <div className="mt-4 grid gap-2">
          {metrics.length === 0 ? <p className="text-sm text-zinc-600">Henuz metrik yok</p> : null}
          {metrics.map((metric) => (
            <article key={metric.name} className="rounded-xl border border-zinc-200 p-3">
              <p className="text-sm font-medium text-zinc-900">{metric.name}</p>
              <p className="text-xs text-zinc-600">
                count: {metric.count} | avg: {metric.avgMs} ms | max: {metric.maxMs} ms
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}


type MetricEntry = {
  name: string
  valueMs: number
  timestamp: number
}

const globalForMetrics = globalThis as unknown as {
  studyflowMetrics?: MetricEntry[]
}

const getStore = () => {
  if (!globalForMetrics.studyflowMetrics) globalForMetrics.studyflowMetrics = []
  return globalForMetrics.studyflowMetrics
}

export const recordMetric = (name: string, valueMs: number) => {
  const store = getStore()
  store.push({ name, valueMs, timestamp: Date.now() })
  if (store.length > 500) store.splice(0, store.length - 500)
}

export const getMetricSummary = () => {
  const store = getStore()
  const grouped = new Map<string, number[]>()

  for (const item of store) {
    const list = grouped.get(item.name) ?? []
    list.push(item.valueMs)
    grouped.set(item.name, list)
  }

  return [...grouped.entries()].map(([name, values]) => {
    const count = values.length
    const avg = values.reduce((sum, value) => sum + value, 0) / Math.max(count, 1)
    const max = Math.max(...values)
    return { name, count, avgMs: Number(avg.toFixed(1)), maxMs: Number(max.toFixed(1)) }
  })
}

"use client"

import { useEffect, useState } from "react"

type TopicItem = {
  id: string
  title: string
  exam: string
  confidenceScore: number | null
}

export const TopicReviewTools = () => {
  const [topics, setTopics] = useState<TopicItem[]>([])
  const [topicId, setTopicId] = useState("")
  const [confidence, setConfidence] = useState(3)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const loadTopics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/topics")
      const data = await response.json()
      const items = (data.topics ?? []) as TopicItem[]
      setTopics(items)
      setTopicId((currentTopicId) => {
        if (items.some((item) => item.id === currentTopicId)) return currentTopicId
        return items[0]?.id ?? ""
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTopics()
  }, [])

  const handleCompleteTopic = async () => {
    if (!topicId) {
      setMessage("Once konu ekleyip plan olustur")
      return
    }

    const response = await fetch("/api/topics/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topicId,
        confidenceScore: confidence,
      }),
    })
    const data = await response.json()
    if (!response.ok) {
      setMessage(data.message ?? "Konu tamamlama islemi basarisiz")
      return
    }
    setMessage(`${data.createdReviewSessions} tekrar seansi eklendi (${data.reviewDays.join(", ")})`)
    await loadTopics()
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="dashboard-title flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/60 text-sm shadow-sm">
          🔁
        </span>
        Konu Tamamlama ve Tekrar
      </h2>
      <p className="mt-1 text-sm text-zinc-600">Guven puanina gore otomatik tekrar seansi olusturur</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
          Konu sayisi: {topics.length}
        </span>
        <button
          type="button"
          onClick={loadTopics}
          className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? "Yenileniyor..." : "Listeyi yenile"}
        </button>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-3">
        <select
          className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          value={topicId}
          onChange={(event) => setTopicId(event.target.value)}
          disabled={topics.length === 0}
        >
          <option value="">
            {topics.length === 0 ? "Konu bulunamadi (once sinav/konu ekle)" : "Konu sec"}
          </option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.exam} - {topic.title} (puan: {topic.confidenceScore ?? "-"})
            </option>
          ))}
        </select>
        <select
          className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          value={confidence}
          onChange={(event) => setConfidence(Number(event.target.value))}
        >
          <option value={1}>1 - Zayif</option>
          <option value={2}>2 - Gelistirilmeli</option>
          <option value={3}>3 - Orta</option>
          <option value={4}>4 - Iyi</option>
          <option value={5}>5 - Cok iyi</option>
        </select>
        <button
          type="button"
          onClick={handleCompleteTopic}
          className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          disabled={!topicId}
        >
          Konuyu tamamla
        </button>
      </div>

      {message ? <p className="mt-3 text-sm text-zinc-600">{message}</p> : null}
    </section>
  )
}

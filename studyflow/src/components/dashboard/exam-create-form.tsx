"use client"

import { FormEvent, useState } from "react"

export const ExamCreateForm = () => {
  const [subject, setSubject] = useState("")
  const [examDate, setExamDate] = useState("")
  const [topicsText, setTopicsText] = useState("")
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM")
  const [maxDailyHours, setMaxDailyHours] = useState(2)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    const topics = topicsText
      .split("\n")
      .map((topic) => topic.trim())
      .filter(Boolean)

    try {
      const response = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          examDate,
          priority,
          maxDailyHours,
          topics,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message ?? "Sinav kaydi olusturulamadi")
        return
      }

      setMessage("Sinav ve konular kaydedildi, liste yenileniyor...")
      window.location.reload()
    } catch {
      setMessage("Baglanti hatasi olustu")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="rounded-2xl border border-violet-200 bg-white/90 p-6 shadow-md">
      <h2 className="dashboard-title flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/60 text-sm shadow-sm">
          📝
        </span>
        Sinav Ekle
      </h2>
      <p className="mt-1 text-sm text-zinc-600">Konu listesini her satira bir konu olacak sekilde yaz</p>

      <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
        <input
          className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          placeholder="Ders adi"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          required
        />
        <input
          className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          type="datetime-local"
          value={examDate}
          onChange={(event) => setExamDate(event.target.value)}
          required
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <select
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
            value={priority}
            onChange={(event) => setPriority(event.target.value as "LOW" | "MEDIUM" | "HIGH")}
          >
            <option value="LOW">Dusuk oncelik</option>
            <option value="MEDIUM">Orta oncelik</option>
            <option value="HIGH">Yuksek oncelik</option>
          </select>
          <input
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
            type="number"
            min={1}
            max={12}
            value={maxDailyHours}
            onChange={(event) => setMaxDailyHours(Number(event.target.value))}
          />
        </div>
        <textarea
          className="min-h-28 rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          placeholder={"Ornek:\nTurev\nIntegral\nLimit"}
          value={topicsText}
          onChange={(event) => setTopicsText(event.target.value)}
          required
        />
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Kaydediliyor..." : "Sinavi kaydet"}
        </button>
      </form>

      {message ? <p className="mt-3 text-sm text-zinc-600">{message}</p> : null}
    </section>
  )
}

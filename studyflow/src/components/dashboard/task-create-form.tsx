"use client"

import { FormEvent, useEffect, useState } from "react"

type ExamOption = {
  id: string
  subject: string
}

export const TaskCreateForm = () => {
  const [title, setTitle] = useState("")
  const [deadlineDate, setDeadlineDate] = useState("")
  const [estimatedHours, setEstimatedHours] = useState(1)
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM")
  const [linkedExamId, setLinkedExamId] = useState("")
  const [exams, setExams] = useState<ExamOption[]>([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("/api/exams")
      .then((response) => response.json())
      .then((data) => {
        const items = (data.exams ?? []) as Array<{ id: string; subject: string }>
        setExams(items)
        if (items[0]?.id) setLinkedExamId(items[0].id)
      })
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage("")
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        deadlineDate,
        estimatedHours,
        priority,
        linkedExamId: linkedExamId || undefined,
      }),
    })
    const data = await response.json()
    if (!response.ok) {
      setMessage(data.message ?? "Gorev kaydedilemedi")
      return
    }
    setMessage("Deadline gorevi kaydedildi")
    setTitle("")
  }

  return (
    <section className="rounded-2xl border border-sky-200 bg-white/90 p-6 shadow-md">
      <h2 className="dashboard-title flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/60 text-sm shadow-sm">
          🗂️
        </span>
        Deadline Gorevi Ekle
      </h2>
      <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
        <input
          className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          placeholder="Gorev basligi"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <input
          className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          type="datetime-local"
          value={deadlineDate}
          onChange={(event) => setDeadlineDate(event.target.value)}
          required
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
            type="number"
            min={1}
            max={20}
            value={estimatedHours}
            onChange={(event) => setEstimatedHours(Number(event.target.value))}
          />
          <select
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
            value={priority}
            onChange={(event) => setPriority(event.target.value as "LOW" | "MEDIUM" | "HIGH")}
          >
            <option value="LOW">Dusuk</option>
            <option value="MEDIUM">Orta</option>
            <option value="HIGH">Yuksek</option>
          </select>
          <select
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
            value={linkedExamId}
            onChange={(event) => setLinkedExamId(event.target.value)}
          >
            <option value="">Sinav baglama (opsiyonel)</option>
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.subject}
              </option>
            ))}
          </select>
        </div>
        <button className="rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:from-sky-500 hover:to-cyan-400">
          Gorevi kaydet
        </button>
      </form>
      {message ? <p className="mt-3 text-sm text-zinc-600">{message}</p> : null}
    </section>
  )
}

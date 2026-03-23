"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

type SessionItem = {
  id: string
  date: string
  durationMinutes: number
  exam: string
  topic: string
  isCompleted: boolean
}

const PlansPage = () => {
  const [sessions, setSessions] = useState<SessionItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const examId = searchParams.get("examId")

  useEffect(() => {
    const load = async () => {
      const suffix = examId ? `?examId=${examId}` : ""
      const response = await fetch(`/api/plans${suffix}`)
      const data = await response.json()
      setSessions(data.sessions ?? [])
      setIsLoading(false)
    }

    load()
  }, [examId])

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl p-4 md:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">Plan Detayi</h1>
      <p className="mt-1 text-sm text-zinc-600">Secilen sinavin veya tum sinavlarin seans listesi</p>

      {isLoading ? <p className="mt-4 text-sm text-zinc-600">Yukleniyor...</p> : null}

      <div className="mt-4 grid gap-3">
        {sessions.map((session) => (
          <article key={session.id} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-sm font-medium text-zinc-900">
              {session.exam} - {session.topic}
            </p>
            <p className="text-xs text-zinc-600">
              {new Date(session.date).toLocaleString("tr-TR")} | {session.durationMinutes} dk
            </p>
          </article>
        ))}
      </div>
    </main>
  )
}

export default PlansPage

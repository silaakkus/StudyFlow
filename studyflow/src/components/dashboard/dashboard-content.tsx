"use client"

import { useEffect, useMemo, useState } from "react"
import { InfoCard } from "@/components/dashboard/info-card"

type DashboardExam = {
  id: string
  subject: string
  date: string
  topicCount: number
  priority: "LOW" | "MEDIUM" | "HIGH"
}

const getCountdownText = (isoDate: string) => {
  const diffMs = new Date(isoDate).getTime() - Date.now()
  if (diffMs <= 0) return "Suresi doldu"

  const totalHours = Math.floor(diffMs / (1000 * 60 * 60))
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  return `${days} gun ${hours} saat kaldi`
}

const getRemainingDays = (isoDate: string, referenceTime: number) => {
  const diffMs = new Date(isoDate).getTime() - referenceTime
  if (diffMs <= 0) return 0
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

const getUrgencyState = (topicCount: number, remainingDays: number) => {
  if (remainingDays <= 0) {
    return {
      value: "Sure doldu",
      subtitle: "Sinav tarihi gecmis",
      tone: "warning" as const,
    }
  }

  const topicPerDayNeed = topicCount / remainingDays
  if (topicPerDayNeed > 1.3) {
    return {
      value: "Hizlanmalisin",
      subtitle: `Gunluk yaklasik ${topicPerDayNeed.toFixed(1)} konu gerekiyor`,
      tone: "warning" as const,
    }
  }

  return {
    value: "Normal tempo",
    subtitle: `Gunluk yaklasik ${topicPerDayNeed.toFixed(1)} konu yeterli`,
    tone: "neutral" as const,
  }
}

export const DashboardContent = () => {
  const [exams, setExams] = useState<DashboardExam[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const loadExams = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/exams")
        const data = await response.json()
        setExams(data.exams ?? [])
      } finally {
        setIsLoading(false)
      }
    }

    loadExams()

    const handleExamsUpdated = () => {
      loadExams()
    }

    window.addEventListener("studyflow:exams-updated", handleExamsUpdated)
    return () => {
      window.removeEventListener("studyflow:exams-updated", handleExamsUpdated)
    }
  }, [])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now())
    }, 60000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  const nearestExam = useMemo(() => exams[0], [exams])
  const totalTopicCount = useMemo(
    () => exams.reduce((sum, exam) => sum + exam.topicCount, 0),
    [exams]
  )
  const remainingDays = useMemo(
    () => (nearestExam ? getRemainingDays(nearestExam.date, now) : 0),
    [nearestExam, now]
  )
  const urgency = useMemo(
    () => getUrgencyState(totalTopicCount, remainingDays),
    [totalTopicCount, remainingDays]
  )

  if (isLoading) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm text-zinc-600">Sinav verileri yukleniyor...</p>
      </section>
    )
  }

  if (!nearestExam) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm text-zinc-600">Henuz sinav verisi bulunmuyor</p>
      </section>
    )
  }

  return (
    <>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <InfoCard
          title="En yakin sinav"
          value={nearestExam.subject}
          subtitle={getCountdownText(nearestExam.date)}
        />
        <InfoCard
          title="Toplam konu"
          value={String(totalTopicCount)}
          subtitle="Bu hafta planlanacak konu sayisi"
        />
        <InfoCard
          title="Durum uyarisi"
          value={urgency.value}
          subtitle={urgency.subtitle}
          tone={urgency.tone}
        />
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="dashboard-title flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/60 text-sm shadow-sm">
            ⏳
          </span>
          Yaklasan sinavlar
        </h2>
        <div className="mt-4 grid gap-3">
          {exams.map((exam) => (
            <InfoCard
              key={exam.id}
              title={exam.subject}
              value={getCountdownText(exam.date)}
              subtitle={`${exam.topicCount} konu | oncelik: ${exam.priority}`}
              tone="neutral"
              href={`/plans?examId=${exam.id}`}
            />
          ))}
        </div>
      </section>
    </>
  )
}

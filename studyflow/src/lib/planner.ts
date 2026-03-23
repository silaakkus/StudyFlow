type PlannerExam = {
  id: string
  subjectName: string
  examDate: Date
  priority: "LOW" | "MEDIUM" | "HIGH"
  maxDailyHours: number
  topics: Array<{ id: string; title: string }>
}

type PlannerTask = {
  id: string
  title: string
  deadlineDate: Date
  estimatedHours: number
}

type PlannedSession = {
  examId: string
  topicId: string | null
  date: Date
  durationMinutes: number
  source: "TOPIC" | "TASK"
  title: string
}

const priorityMultiplier: Record<PlannerExam["priority"], number> = {
  LOW: 1,
  MEDIUM: 1.2,
  HIGH: 1.5,
}

const startOfDay = (date: Date) => {
  const value = new Date(date)
  value.setHours(9, 0, 0, 0)
  return value
}

const endOfDay = (date: Date) => {
  const value = new Date(date)
  value.setHours(21, 0, 0, 0)
  return value
}

const addDays = (date: Date, day: number) => {
  const value = new Date(date)
  value.setDate(value.getDate() + day)
  return value
}

export const generatePlan = (exams: PlannerExam[], tasks: PlannerTask[]) => {
  const sessions: PlannedSession[] = []
  const dailyUsageMinutes = new Map<string, number>()

  const getDateKey = (date: Date) => date.toISOString().slice(0, 10)

  const reserveMinutes = (date: Date, minutes: number) => {
    const key = getDateKey(date)
    dailyUsageMinutes.set(key, (dailyUsageMinutes.get(key) ?? 0) + minutes)
  }

  const getUsedMinutes = (date: Date) => {
    return dailyUsageMinutes.get(getDateKey(date)) ?? 0
  }

  const sortedExams = [...exams].sort(
    (a, b) =>
      a.examDate.getTime() - b.examDate.getTime() ||
      priorityMultiplier[b.priority] - priorityMultiplier[a.priority]
  )

  for (const exam of sortedExams) {
    const today = startOfDay(new Date())
    const totalDays = Math.max(
      1,
      Math.ceil((exam.examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    )
    const topicMinutes = Math.ceil((exam.topics.length * 60 * priorityMultiplier[exam.priority]) / totalDays)
    const boundedDailyMinutes = Math.min(exam.maxDailyHours * 60, Math.max(30, topicMinutes))

    for (let dayOffset = 0; dayOffset < totalDays; dayOffset += 1) {
      const dayDate = startOfDay(addDays(today, dayOffset))
      if (dayDate > exam.examDate) break

      const availableForExam = Math.max(0, boundedDailyMinutes - getUsedMinutes(dayDate))
      if (availableForExam <= 0) continue

      const sessionCount = Math.max(1, Math.floor(availableForExam / 60))
      for (let index = 0; index < sessionCount; index += 1) {
        const topic = exam.topics[(dayOffset + index) % Math.max(exam.topics.length, 1)]
        if (!topic) continue

        const usedHourOffset = Math.floor(getUsedMinutes(dayDate) / 60)
        const slotDate = new Date(dayDate)
        slotDate.setHours(9 + usedHourOffset + index, 0, 0, 0)
        if (slotDate > endOfDay(dayDate)) break

        sessions.push({
          examId: exam.id,
          topicId: topic.id,
          date: slotDate,
          durationMinutes: 60,
          source: "TOPIC",
          title: `${exam.subjectName} - ${topic.title}`,
        })
        reserveMinutes(dayDate, 60)
      }
    }
  }

  const sortedTasks = [...tasks].sort((a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime())
  for (const task of sortedTasks) {
    const minutesNeeded = Math.max(30, task.estimatedHours * 60)
    const latestDay = startOfDay(task.deadlineDate)
    let assigned = false

    for (let back = 0; back <= 14; back += 1) {
      const day = startOfDay(addDays(latestDay, -back))
      if (day < startOfDay(new Date())) break

      const used = getUsedMinutes(day)
      const limit = 4 * 60
      if (used + minutesNeeded > limit) continue

      const slotDate = new Date(day)
      slotDate.setHours(17, 0, 0, 0)

      sessions.push({
        examId: exams[0]?.id ?? "",
        topicId: null,
        date: slotDate,
        durationMinutes: minutesNeeded,
        source: "TASK",
        title: `Deadline: ${task.title}`,
      })
      reserveMinutes(day, minutesNeeded)
      assigned = true
      break
    }

    if (!assigned) {
      const fallbackDay = startOfDay(new Date())
      const slotDate = new Date(fallbackDay)
      slotDate.setHours(20, 0, 0, 0)

      sessions.push({
        examId: exams[0]?.id ?? "",
        topicId: null,
        date: slotDate,
        durationMinutes: minutesNeeded,
        source: "TASK",
        title: `Deadline: ${task.title}`,
      })
      reserveMinutes(fallbackDay, minutesNeeded)
    }
  }

  return sessions.sort((a, b) => a.date.getTime() - b.date.getTime())
}

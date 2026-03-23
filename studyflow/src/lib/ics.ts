type IcsEvent = {
  title: string
  description: string
  start: Date
  end: Date
}

const toIcsDate = (date: Date) => {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
}

export const createIcsFile = (events: IcsEvent[]) => {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//StudyFlow//TR",
    "CALSCALE:GREGORIAN",
  ]

  for (const event of events) {
    lines.push("BEGIN:VEVENT")
    lines.push(`UID:${crypto.randomUUID()}@studyflow.local`)
    lines.push(`DTSTAMP:${toIcsDate(new Date())}`)
    lines.push(`DTSTART:${toIcsDate(event.start)}`)
    lines.push(`DTEND:${toIcsDate(event.end)}`)
    lines.push(`SUMMARY:${event.title}`)
    lines.push(`DESCRIPTION:${event.description}`)
    lines.push("END:VEVENT")
  }

  lines.push("END:VCALENDAR")
  return lines.join("\r\n")
}

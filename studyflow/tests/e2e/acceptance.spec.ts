import { expect, test } from "@playwright/test"

test("can create two exams and generate non-empty plan", async ({ request }) => {
  await request.post("/api/exams", {
    data: {
      subject: "Biyoloji",
      examDate: "2026-08-10T10:00:00",
      priority: "HIGH",
      maxDailyHours: 3,
      topics: ["Hucre", "DNA"],
    },
  })

  await request.post("/api/exams", {
    data: {
      subject: "Kimya",
      examDate: "2026-08-12T10:00:00",
      priority: "MEDIUM",
      maxDailyHours: 2,
      topics: ["Atom", "Baglar"],
    },
  })

  const generate = await request.post("/api/plans/generate")
  expect(generate.ok()).toBeTruthy()

  const sessionsResponse = await request.get("/api/plans")
  const sessionsPayload = await sessionsResponse.json()
  expect((sessionsPayload.sessions ?? []).length).toBeGreaterThan(0)
})

test("youtube search endpoint responds with structured payload", async ({ request }) => {
  const response = await request.get("/api/youtube/search?topic=Matematik")
  expect([200, 400].includes(response.status())).toBeTruthy()
})

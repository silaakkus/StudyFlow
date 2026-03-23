import { expect, test } from "@playwright/test"

test("dashboard, exam create and plan generation flow", async ({ page }) => {
  await page.goto("/")

  await expect(page.getByText("StudyFlow Dashboard")).toBeVisible()

  await page.getByPlaceholder("Ders adi").fill("Kimya")
  await page.locator("input[type='datetime-local']").fill("2026-07-10T10:00")
  await page.locator("textarea").fill("Organik\nTepkimeler")
  await page.getByRole("button", { name: "Sinavi kaydet" }).click()

  await expect(page.getByText("Sinav ve konular kaydedildi, liste yenileniyor...")).toBeVisible()
})

test("plan generate button visible", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("button", { name: "Plani olustur" })).toBeVisible()
})

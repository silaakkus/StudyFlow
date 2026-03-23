import fs from "node:fs"
import process from "node:process"
import { performance } from "node:perf_hooks"

const budget = JSON.parse(fs.readFileSync(new URL("../performance-budget.json", import.meta.url), "utf-8"))
const target = process.env.PERF_CHECK_URL || "http://127.0.0.1:3000"

const run = async () => {
  const start = performance.now()
  const response = await fetch(target)
  const elapsed = performance.now() - start

  if (!response.ok) {
    console.error(`Perf check failed: ${response.status}`)
    process.exit(1)
  }

  const limit = budget.pageLoadBudgetMs
  console.log(`Page load: ${Math.round(elapsed)}ms (budget: ${limit}ms)`)
  if (elapsed > limit) {
    console.error("Performance budget exceeded")
    process.exit(1)
  }

  console.log("Performance budget check passed")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})

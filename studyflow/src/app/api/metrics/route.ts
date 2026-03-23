import { NextResponse } from "next/server"
import { getMetricSummary } from "@/lib/metrics"

export const GET = async () => {
  return NextResponse.json(
    {
      ok: true,
      metrics: getMetricSummary(),
    },
    { status: 200 }
  )
}

import { NextResponse } from "next/server"

export const GET = async () => {
  return NextResponse.json(
    {
      ok: true,
      service: "studyflow-api",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  )
}

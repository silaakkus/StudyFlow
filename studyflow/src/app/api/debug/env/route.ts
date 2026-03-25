import { NextResponse } from "next/server"

const has = (value: string | undefined) => Boolean(value && value.trim())

export const GET = async () => {
  // Değerleri döndürmüyoruz (gizlilik). Sadece var/yok bilgisini veriyoruz.
  const env = {
    DATABASE_URL: has(process.env.DATABASE_URL),
    AUTH_GOOGLE_ID: has(process.env.AUTH_GOOGLE_ID),
    AUTH_GOOGLE_SECRET: has(process.env.AUTH_GOOGLE_SECRET),
    NEXTAUTH_URL: has(process.env.NEXTAUTH_URL),
    NEXTAUTH_SECRET: has(process.env.NEXTAUTH_SECRET),
    AUTH_SECRET: has(process.env.AUTH_SECRET),
    YOUTUBE_API_KEY: has(process.env.YOUTUBE_API_KEY),
  }

  const missing = Object.entries(env)
    .filter(([, ok]) => !ok)
    .map(([key]) => key)

  return NextResponse.json(
    {
      ok: missing.length === 0,
      missing,
      env,
      timestamp: new Date().toISOString(),
    },
    { status: missing.length === 0 ? 200 : 200 }
  )
}


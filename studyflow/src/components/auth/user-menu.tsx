"use client"

import { signOut, useSession } from "next-auth/react"

export const UserMenu = () => {
  const { data: session, status } = useSession()

  if (status === "loading") return null

  const displayName =
    session?.user?.name ?? session?.user?.email ?? session?.user?.id ?? "Kullanici"

  if (!session) {
    return (
      <a
        href="/auth/signin"
        className="micro-button group relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-xl ring-2 ring-white/40 transition hover:scale-[1.04] hover:from-violet-500 hover:via-fuchsia-400 hover:to-sky-400"
      >
        <span className="hero-shimmer pointer-events-none absolute inset-y-0 left-0 w-16 bg-white/70 blur-md" />
        Google ile giris
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="micro-button group relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-xl ring-2 ring-white/40 transition hover:scale-[1.04] hover:from-emerald-500 hover:via-teal-400 hover:to-cyan-400"
      aria-label="Oturumu kapat"
    >
      <span className="hero-shimmer pointer-events-none absolute inset-y-0 left-0 w-16 bg-white/70 blur-md" />
      Cikis Yap
      <span className="ml-2 hidden text-xs font-semibold text-white/90 sm:inline">
        {displayName}
      </span>
    </button>
  )
}


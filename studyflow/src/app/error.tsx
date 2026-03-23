"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg items-center px-4">
      <section className="w-full rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-lg font-semibold text-red-900">Bir hata olustu</h1>
        <p className="mt-2 text-sm text-red-800">{error.message || "Beklenmeyen bir hata"}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-xl bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
        >
          Tekrar dene
        </button>
      </section>
    </main>
  )
}

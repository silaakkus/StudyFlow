import { signIn } from "@/auth"

const SignInPage = () => {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <section className="w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-900">StudyFlow Giris</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Planlarini kaydetmek ve takvim entegrasyonu icin Google ile giris yap
        </p>

        <form
          className="mt-5"
          action={async () => {
            "use server"
            // next-auth v4: server-side signIn uses `callbackUrl`
            await signIn("google", { callbackUrl: "/" })
          }}
        >
          <button
            type="submit"
            className="w-full rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Google ile giris yap
          </button>
        </form>
      </section>
    </main>
  )
}

export default SignInPage

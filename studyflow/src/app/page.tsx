import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { ExamCreateForm } from "@/components/dashboard/exam-create-form"
import { PlanGenerator } from "@/components/dashboard/plan-generator"
import { YoutubeTools } from "@/components/dashboard/youtube-tools"
import { CalendarTools } from "@/components/dashboard/calendar-tools"
import { TopicReviewTools } from "@/components/dashboard/topic-review-tools"
import { TaskCreateForm } from "@/components/dashboard/task-create-form"
import { PerformancePanel } from "@/components/dashboard/performance-panel"
import { WeeklySummaryPanel } from "@/components/dashboard/weekly-summary"
import { AlertsCenter } from "@/components/dashboard/alerts-center"
import { AnalyticsPanel } from "@/components/dashboard/analytics-panel"
import { UserMenu } from "@/components/auth/user-menu"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
})

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-sky-100 to-fuchsia-100 p-4 md:p-8">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="relative overflow-hidden rounded-3xl border border-violet-200 bg-white/90 p-6 shadow-lg backdrop-blur">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-violet-100/50 via-transparent to-fuchsia-100/50" />
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative">
              <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold tracking-wide text-violet-700">
                Akilli Ogrenci Planlayici
              </span>
              <h1
                className={`${poppins.className} animated-hero-gradient mt-2 bg-gradient-to-r from-violet-700 via-fuchsia-600 to-sky-600 bg-clip-text text-3xl font-extrabold leading-tight text-transparent md:text-5xl`}
              >
                StudyFlow Dashboard
              </h1>
              <p className="mt-2 max-w-xl text-sm text-zinc-700 md:text-base">
                Sinav geri sayimi, calisma plani ve odaklanmis gorev akisi tek ekranda
              </p>
            </div>

              <UserMenu />
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <a
            href="#exam-form"
            className="micro-button relative overflow-hidden rounded-2xl border border-violet-200 bg-white/85 p-4 shadow-md backdrop-blur"
          >
            <span className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-base shadow-sm">
              📝
            </span>
            <p className="text-sm font-bold text-violet-700">Hizli Baslat 01</p>
            <p className="mt-1 text-lg font-semibold text-zinc-900">Sinav Ekle</p>
            <p className="mt-2 text-xs text-zinc-600">
              Hedef tarihi ve konu listesini girerek planlamayi tek adimda baslat.
            </p>
          </a>
          <a
            href="#plan-generator"
            className="micro-button relative overflow-hidden rounded-2xl border border-fuchsia-200 bg-white/85 p-4 shadow-md backdrop-blur"
          >
            <span className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-fuchsia-100 text-base shadow-sm">
              ⚡
            </span>
            <p className="text-sm font-bold text-fuchsia-700">Hizli Baslat 02</p>
            <p className="mt-1 text-lg font-semibold text-zinc-900">Plani Uret</p>
            <p className="mt-2 text-xs text-zinc-600">
              Dakikalar, oncelikler ve son tarihlere gore otomatik seans dagitimi yap.
            </p>
          </a>
          <a
            href="#focus-mode"
            className="micro-button relative overflow-hidden rounded-2xl border border-sky-200 bg-white/85 p-4 shadow-md backdrop-blur"
          >
            <span className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-base shadow-sm">
              🎯
            </span>
            <p className="text-sm font-bold text-sky-700">Hizli Baslat 03</p>
            <p className="mt-1 text-lg font-semibold text-zinc-900">Odak Modu</p>
            <p className="mt-2 text-xs text-zinc-600">
              25+5 duzeniyle seansa gir, dikkat daginikligini azalt ve sureklilik yakala.
            </p>
          </a>
        </section>

        <section className="rounded-2xl border border-white/50 bg-white/65 p-4 shadow-md backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-zinc-600">Bugun</p>
              <p className="text-lg font-bold text-zinc-900">Gunluk Ilerleme Ozeti</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-violet-700">
                Hedef: 120 dk
              </span>
              <span className="rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-fuchsia-700">
                Tamamlanan: 2 seans
              </span>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700">
                Siradaki: Matematik tekrar
              </span>
            </div>
          </div>
        </section>

        <section id="exam-form" className="scroll-mt-24">
          <ExamCreateForm />
        </section>
        <TaskCreateForm />
        <section id="plan-generator" className="scroll-mt-24">
          <PlanGenerator />
        </section>
        <DashboardContent />
        <section id="youtube-tools" className="scroll-mt-24">
          <YoutubeTools />
        </section>
        <section id="calendar-tools" className="scroll-mt-24">
          <CalendarTools />
        </section>
        <section id="focus-mode" className="scroll-mt-24">
          <TopicReviewTools />
        </section>
        <WeeklySummaryPanel />
        <div id="alerts-center" className="scroll-mt-24">
          <AlertsCenter />
        </div>
        <div id="analytics-panel" className="scroll-mt-24">
          <AnalyticsPanel />
          <PerformancePanel />
        </div>

        <footer className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/35 p-5 shadow-2xl backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 via-transparent to-violet-200/20" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/60 text-lg shadow-sm">
                ✨
              </span>
              <p className="text-base font-bold text-zinc-900">StudyFlow ile neler yapabilirsin?</p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
              <a
                href="#exam-form"
                className="micro-button rounded-xl border border-white/50 bg-white/55 px-3 py-3 text-left text-zinc-700 backdrop-blur transition hover:bg-white/75"
              >
                <p className="flex items-center gap-2 font-semibold text-zinc-900">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100">📚</span>
                  Planini Baslat
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  Sinav ve konu listeni gir, sistem hedef tarihe gore otomatik calisma akisi olustursun.
                </p>
              </a>
              <a
                href="#focus-mode"
                className="micro-button rounded-xl border border-white/50 bg-white/55 px-3 py-3 text-left text-zinc-700 backdrop-blur transition hover:bg-white/75"
              >
                <p className="flex items-center gap-2 font-semibold text-zinc-900">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-fuchsia-100">⏱️</span>
                  Odak Modunu Ac
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  25+5 pomodoro sayaci ile dikkat dagilimini azalt, oturumlari ritmik sekilde tamamla.
                </p>
              </a>
              <a
                href="#youtube-tools"
                className="micro-button rounded-xl border border-white/50 bg-white/55 px-3 py-3 text-left text-zinc-700 backdrop-blur transition hover:bg-white/75"
              >
                <p className="flex items-center gap-2 font-semibold text-zinc-900">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-red-100">🎬</span>
                  Kaynaklari Eslestir
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  Konu bazli YouTube aramasiyla dogru videoyu bul, secili calisma seansina tek tikla bagla.
                </p>
              </a>
              <a
                href="#calendar-tools"
                className="micro-button rounded-xl border border-white/50 bg-white/55 px-3 py-3 text-left text-zinc-700 backdrop-blur transition hover:bg-white/75"
              >
                <p className="flex items-center gap-2 font-semibold text-zinc-900">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100">📆</span>
                  Takvime Aktar
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  Tum plani veya tek seansi Google Takvim ya da ICS ile paylas, gundelik akisa kolayca entegre et.
                </p>
              </a>
              <a
                href="#alerts-center"
                className="micro-button rounded-xl border border-white/50 bg-white/55 px-3 py-3 text-left text-zinc-700 backdrop-blur transition hover:bg-white/75"
              >
                <p className="flex items-center gap-2 font-semibold text-zinc-900">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">🔔</span>
                  Akilli Hatirlatmalar
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  7/3/1 gun sinav uyarilari ve gunluk oturum hatirlatmalariyla calisma rutininin disina cikma.
                </p>
              </a>
              <a
                href="#analytics-panel"
                className="micro-button rounded-xl border border-white/50 bg-white/55 px-3 py-3 text-left text-zinc-700 backdrop-blur transition hover:bg-white/75"
              >
                <p className="flex items-center gap-2 font-semibold text-zinc-900">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">📊</span>
                  Gelisimi Takip Et
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  Haftalik dakika ozetleri, ders dagilimlari ve streak metrikleriyle performansini gorunur kil.
                </p>
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

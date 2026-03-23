import Link from "next/link"

type InfoCardProps = {
  title: string
  value: string
  subtitle: string
  tone?: "neutral" | "warning"
  href?: string
}

const toneClasses: Record<NonNullable<InfoCardProps["tone"]>, string> = {
  neutral: "border-violet-200 bg-gradient-to-br from-white to-violet-50",
  warning: "border-amber-300 bg-gradient-to-br from-amber-50 to-rose-50",
}

export const InfoCard = ({
  title,
  value,
  subtitle,
  tone = "neutral",
  href,
}: InfoCardProps) => {
  const content = (
    <article
      className={`rounded-2xl border p-5 shadow-md transition hover:-translate-y-0.5 ${toneClasses[tone]}`}
      aria-label={`${title} bilgi karti`}
    >
      <p className="text-sm font-semibold text-violet-700">{title}</p>
      <p className="mt-2 text-2xl font-extrabold text-zinc-900">{value}</p>
      <p className="mt-2 text-sm text-zinc-500">{subtitle}</p>
    </article>
  )

  if (!href) return content

  return (
    <Link href={href} className="block transition hover:opacity-95">
      {content}
    </Link>
  )
}

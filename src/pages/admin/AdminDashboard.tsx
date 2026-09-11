import { useEffect, useState } from 'react'
import { fetchAdminStats, type AdminStats } from '@/lib/adminQueries'
import { Notice, Spinner } from '@/components/ui/field'

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold tabular-nums tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function RankList({
  title,
  rows,
  unit,
}: {
  title: string
  rows: { title: string; count: number }[]
  unit: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <h2 className="font-display text-sm font-bold tracking-tight">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Hələ məlumat yoxdur.</p>
      ) : (
        <ol className="mt-4 space-y-2.5">
          {rows.map((r, i) => (
            <li key={r.title} className="flex items-center gap-3 text-sm">
              <span className="font-display text-xs tabular-nums text-primary/50">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 flex-1 truncate">{r.title}</span>
              <span className="tabular-nums text-muted-foreground">
                {r.count} {unit}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    fetchAdminStats()
      .then((s) => active && setStats(s))
      .catch((e: Error) => active && setError(e.message))
    return () => {
      active = false
    }
  }, [])

  if (error) return <Notice tone="error">Statistika yüklənmədi: {error}</Notice>
  if (!stats)
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-6 w-6 text-primary" />
      </div>
    )

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight">Ümumi baxış</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Qeydiyyatlı istifadəçi" value={stats.users} />
        <Stat
          label="Kurslar"
          value={stats.courses}
          hint={`${stats.publishedCourses} dərc olunub`}
        />
        <Stat label="Verilmiş kurs çıxışı" value={stats.enrollments} />
        <Stat
          label="Cavablanmamış sorğu"
          value={stats.openRequests}
          hint="Pullu kurs üçün WhatsApp sorğuları"
        />
        <Stat label="Tamamlanmış dərs" value={stats.completedLessons} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <RankList
          title="Ən çox baxılan kurslar"
          rows={stats.topViewed.map((r) => ({ title: r.title, count: r.views }))}
          unit="baxış"
        />
        <RankList
          title="Ən çox sorğu gələn kurslar"
          rows={stats.topRequested.map((r) => ({ title: r.title, count: r.requests }))}
          unit="sorğu"
        />
      </div>
    </div>
  )
}

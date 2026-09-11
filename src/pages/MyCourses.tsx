import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { fetchMyCourses, type EnrolledCourse } from '@/lib/queries'
import { CATEGORY_LABELS } from '@/types/db'
import { useAuth } from '@/context/AuthContext'
import { friendlyErrorMessage } from '@/lib/errors'
import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/button'
import { Badge, Notice, Spinner } from '@/components/ui/field'

export default function MyCourses() {
  const { user, profile } = useAuth()
  const [items, setItems] = useState<EnrolledCourse[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    let active = true
    fetchMyCourses(user.id)
      .then((r) => active && setItems(r))
      .catch(() => active && setError(friendlyErrorMessage()))
    return () => {
      active = false
    }
  }, [user])

  const firstName = profile?.full_name?.split(' ')[0] ?? ''

  return (
    <div className="pb-24 pt-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {firstName ? `Salam, ${firstName}` : 'Mənim təlimlərim'}
          </h1>
          <p className="mt-3 text-muted-foreground">
            Çıxışın olan bütün təlimlər burada.
          </p>
        </Reveal>

        <div className="mt-12">
          {error && <Notice tone="error">{error}</Notice>}

          {!items && !error && (
            <div className="flex justify-center py-20">
              <Spinner className="h-6 w-6 text-primary" />
            </div>
          )}

          {items && items.length === 0 && (
            <Reveal>
              <div className="rounded-3xl border border-dashed border-border px-6 py-20 text-center">
                <p className="font-display text-xl font-bold">Hələ təlimin yoxdur</p>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Pulsuz təlimlərə dərhal başlaya bilərsən. Pullu təlim sifariş etmisənsə,
                  təsdiqdən sonra burada görünəcək.
                </p>
                <Link to="/telimler" className="mt-8 inline-block">
                  <Button size="lg">Təlimlərə bax</Button>
                </Link>
              </div>
            </Reveal>
          )}

          {items && items.length > 0 && (
            <ul className="space-y-4">
              {items.map((it, i) => (
                <Reveal key={it.course.id} as="li" delay={i * 70}>
                  <Link
                    to={`/telimlerim/${it.course.slug}`}
                    className="group flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_24px_60px_-40px_hsl(var(--primary)/0.4)] sm:flex-row sm:items-center"
                  >
                    <div className="h-24 w-full shrink-0 overflow-hidden rounded-2xl bg-secondary sm:w-40">
                      {it.course.thumbnail_url ? (
                        <img
                          src={it.course.thumbnail_url}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-xs uppercase tracking-widest text-primary/30">
                            {CATEGORY_LABELS[it.course.category]}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge tone={it.percent === 100 ? 'done' : 'neutral'}>
                          {it.percent === 100 ? 'Tamamlandı' : `${it.percent}%`}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {it.completedLessons}/{it.totalLessons} dərs
                        </span>
                      </div>

                      <h2 className="mt-2.5 font-display text-lg font-bold tracking-tight">
                        {it.course.title}
                      </h2>

                      <div
                        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary"
                        role="progressbar"
                        aria-valuenow={it.percent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${it.course.title} tamamlanma faizi`}
                      >
                        <div
                          className="h-full rounded-full bg-primary transition-[width] duration-500"
                          style={{ width: `${it.percent}%` }}
                        />
                      </div>
                    </div>

                    <ArrowUpRight className="hidden h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary sm:block" />
                  </Link>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

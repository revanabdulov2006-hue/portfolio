import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, ChevronLeft, ChevronRight, FileText, PartyPopper } from 'lucide-react'
import {
  fetchCoursePlayer,
  markLessonComplete,
  unmarkLessonComplete,
  type CoursePlayerData,
} from '@/lib/queries'
import { driveEmbedUrl } from '@/lib/drive'
import { friendlyErrorMessage } from '@/lib/errors'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Notice, Spinner } from '@/components/ui/field'
import { cn } from '@/lib/utils'

export default function LessonPanel() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [data, setData] = useState<CoursePlayerData | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)

  useEffect(() => {
    if (!user) return
    let active = true
    setLoading(true)

    fetchCoursePlayer(slug, user.id)
      .then((d) => {
        if (!active) return
        if (!d) {
          setError('Bu təlim tapılmadı və ya sənin çıxışın yoxdur.')
          return
        }
        setData(d)
        // İlk tamamlanmamış dərsdən başla.
        const next = d.lessons.findIndex((l) => !d.completed.has(l.id))
        setActiveIndex(next === -1 ? 0 : next)
      })
      .catch(() => active && setError(friendlyErrorMessage()))
      .finally(() => active && setLoading(false))

    return () => {
      active = false
    }
  }, [slug, user])

  const lesson = data?.lessons[activeIndex] ?? null
  const isDone = lesson ? data!.completed.has(lesson.id) : false

  const completedCount = data?.completed.size ?? 0
  const total = data?.lessons.length ?? 0
  const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100)

  const embedUrl = useMemo(() => driveEmbedUrl(lesson?.video_url), [lesson?.video_url])

  const toggleComplete = useCallback(async () => {
    if (!user || !lesson || !data) return
    setSaving(true)
    try {
      const next = new Set(data.completed)
      if (isDone) {
        await unmarkLessonComplete(user.id, lesson.id)
        next.delete(lesson.id)
      } else {
        await markLessonComplete(user.id, lesson.id)
        next.add(lesson.id)
      }
      setData({ ...data, completed: next })

      // Bütün dərslər bitdi → təbrik.
      if (!isDone && next.size === data.lessons.length && data.lessons.length > 0) {
        setShowCongrats(true)
      } else if (!isDone && activeIndex < data.lessons.length - 1) {
        setActiveIndex(activeIndex + 1)
      }
    } catch {
      setError(friendlyErrorMessage())
    } finally {
      setSaving(false)
    }
  }, [user, lesson, data, isDone, activeIndex])

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Spinner className="h-6 w-6 text-primary" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-xl px-5 pb-24 pt-32 text-center">
        <h1 className="font-display text-2xl font-bold">{error ?? 'Təlim tapılmadı'}</h1>
        <Link to="/telimlerim" className="mt-6 inline-block text-primary hover:underline">
          Mənim təlimlərimə qayıt
        </Link>
      </div>
    )
  }

  if (showCongrats) {
    return (
      <div className="mx-auto flex min-h-[80svh] max-w-lg flex-col items-center justify-center px-5 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent">
          <PartyPopper className="h-9 w-9 text-primary" />
        </div>
        <h1 className="mt-8 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Təbrik edirəm!
        </h1>
        <p className="mt-4 text-muted-foreground">
          «{data.course.title}» təliminin bütün dərslərini tamamladın. İndi öyrəndiklərini
          tətbiq etmək vaxtıdır.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={() => setShowCongrats(false)}>
            Dərslərə qayıt
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/telimler')}>
            Digər təlimlərə bax
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 pb-20 sm:px-8 lg:grid-cols-[300px_1fr]">
        {/* ---- Sidebar: dərs siyahısı ---- */}
        <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto">
          <Link
            to="/telimlerim"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Təlimlərim
          </Link>

          <h1 className="mt-5 font-display text-xl font-bold leading-snug tracking-tight">
            {data.course.title}
          </h1>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {completedCount}/{total} dərs
              </span>
              <span className="tabular-nums">{percent}%</span>
            </div>
            <div
              className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <ol className="mt-6 space-y-1">
            {data.lessons.map((l, i) => {
              const done = data.completed.has(l.id)
              const active = i === activeIndex
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    aria-current={active ? 'true' : undefined}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors',
                      active ? 'bg-secondary' : 'hover:bg-secondary/60',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] tabular-nums',
                        done
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border text-muted-foreground',
                      )}
                    >
                      {done ? <Check className="h-3 w-3" /> : i + 1}
                    </span>
                    <span
                      className={cn(
                        'text-sm leading-snug',
                        active ? 'font-medium text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {l.title}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </aside>

        {/* ---- Dərs məzmunu ---- */}
        <div className="min-w-0">
          {data.lessons.length === 0 && (
            <Notice tone="info">Bu təlimə hələ dərs əlavə edilməyib.</Notice>
          )}

          {lesson && (
            <>
              <p className="text-xs uppercase tracking-[0.18em] text-primary">
                Dərs {activeIndex + 1} / {total}
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                {lesson.title}
              </h2>

              <div className="mt-7 overflow-hidden rounded-3xl border border-border bg-foreground/5">
                {embedUrl ? (
                  <div className="aspect-video">
                    <iframe
                      key={lesson.id}
                      src={embedUrl}
                      title={lesson.title}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      className="h-full w-full border-0"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center px-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Bu dərsin videosu hələ əlavə edilməyib və ya link düzgün deyil.
                    </p>
                  </div>
                )}
              </div>

              {lesson.description && (
                <div className="mt-7 space-y-3 text-[15px] leading-relaxed text-foreground/85">
                  {lesson.description.split('\n').filter(Boolean).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}

              {/* Materiallar */}
              {(data.materials[lesson.id]?.length ?? 0) > 0 && (
                <div className="mt-9">
                  <h3 className="font-display text-lg font-bold tracking-tight">
                    Dərs materialları
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {data.materials[lesson.id].map((m) => (
                      <li key={m.id}>
                        <a
                          href={m.file_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary/30 hover:bg-secondary/50"
                        >
                          <FileText className="h-5 w-5 shrink-0 text-primary" />
                          <span className="text-[15px]">{m.title}</span>
                          <span className="ml-auto text-xs uppercase text-muted-foreground">
                            {m.kind}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {error && (
                <div className="mt-7">
                  <Notice tone="error">{error}</Notice>
                </div>
              )}

              {/* Tamamlama + naviqasiya */}
              <div className="mt-10 flex flex-col gap-4 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  size="lg"
                  variant={isDone ? 'outline' : 'primary'}
                  onClick={toggleComplete}
                  disabled={saving}
                >
                  {saving ? <Spinner /> : <Check className="h-5 w-5" />}
                  {isDone ? 'Tamamlanmadı kimi işarələ' : 'Dərsi tamamladım'}
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                    disabled={activeIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Əvvəlki
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setActiveIndex((i) => Math.min(total - 1, i + 1))}
                    disabled={activeIndex >= total - 1}
                  >
                    Növbəti
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

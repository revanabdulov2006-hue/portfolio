import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, ChevronLeft, ChevronRight, PartyPopper } from 'lucide-react'
import {
  getSampleCourse,
  readSampleProgress,
  writeSampleProgress,
} from '@/content/sampleCourses'
import { Button } from '@/components/ui/button'
import { Notice } from '@/components/ui/field'
import { cn } from '@/lib/utils'

/**
 * Nümunə dərs paneli — `/telimler/:slug/izle`.
 *
 * Real panel (`LessonPanel`) Supabase-dən məlumat çəkir və `RequireAuth`
 * altındadır. Baza qurulmadan funnelin sonunu göstərmək üçün bu ictimai
 * nüsxə lazımdır: eyni quruluş, eyni dizayn, məlumat isə sampleCourses-dan,
 * tamamlama qeydləri localStorage-da.
 */
export default function SampleLessonPanel() {
  const { slug = '' } = useParams()
  const course = getSampleCourse(slug)

  /*
   * Saxlanmış progress state-in ilkin dəyəri kimi oxunur, effektlə deyil —
   * effekt əlavə render dövrü yaradardı və panel bir an sıfır faizlə açılardı.
   * Route elementində `key={slug}` var, ona görə başqa təlimə keçəndə komponent
   * yenidən mount olur və ilkin dəyər təzədən hesablanır.
   */
  const [done, setDone] = useState<Set<string>>(() => readSampleProgress(slug))
  const [activeIndex, setActiveIndex] = useState(() => {
    if (!course) return 0
    const saved = readSampleProgress(slug)
    const next = course.lessons.findIndex((l) => !saved.has(l.id))
    return next === -1 ? 0 : next
  })
  const [showCongrats, setShowCongrats] = useState(false)

  const lessons = useMemo(() => course?.lessons ?? [], [course])
  const total = lessons.length
  const lesson = lessons[activeIndex] ?? null
  const isDone = lesson ? done.has(lesson.id) : false
  const percent = total === 0 ? 0 : Math.round((done.size / total) * 100)

  if (!course) {
    return (
      <div className="mx-auto max-w-xl px-5 pb-24 pt-32 text-center">
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
          Bu təlim tapılmadı.
        </h1>
        <Link to="/telimler" className="mt-6 inline-block text-primary hover:underline">
          Bütün təlimlərə qayıt
        </Link>
      </div>
    )
  }

  function toggleComplete() {
    if (!lesson) return
    const next = new Set(done)
    if (next.has(lesson.id)) next.delete(lesson.id)
    else next.add(lesson.id)

    setDone(next)
    writeSampleProgress(slug, next)

    if (next.size === total && total > 0) setShowCongrats(true)
    // Tamamlananda avtomatik növbəti dərsə keç — axını kəsmir.
    else if (next.size > done.size && activeIndex < total - 1) {
      setActiveIndex((i) => i + 1)
    }
  }

  return (
    <div className="pb-32 pt-28 sm:pt-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Link
          to={`/telimler/${slug}`}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Təlim səhifəsi
        </Link>

        <p className="mt-8 text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
          Nümunə panel — videolar real təlimlərdə yerləşdiriləcək
        </p>

        <div className="mt-10 grid gap-12 lg:grid-cols-[300px_1fr] lg:gap-16">
          {/* ---- Sidebar: dərs siyahısı ---- */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <h1
              className="font-display font-extrabold uppercase leading-[1.05] tracking-tighter"
              style={{ fontSize: 'clamp(1.25rem, 2.6vw, 1.75rem)' }}
            >
              {course.title}
            </h1>

            <div className="mt-6">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="tabular-nums">
                  {done.size}/{total} dərs
                </span>
                <span className="tabular-nums">{percent}%</span>
              </div>
              <div
                className="mt-3 h-px w-full bg-foreground/20"
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-px bg-primary transition-[width] duration-700"
                  style={{
                    width: `${percent}%`,
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </div>
            </div>

            <ol className="mt-8 border-t border-foreground/15">
              {lessons.map((l, i) => {
                const complete = done.has(l.id)
                const active = i === activeIndex
                return (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      aria-current={active ? 'true' : undefined}
                      className={cn(
                        'group flex w-full items-center gap-4 border-b border-foreground/15 py-4 text-left transition-opacity',
                        active ? 'opacity-100' : 'opacity-55 hover:opacity-85',
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'shrink-0 font-display font-extrabold leading-none tabular-nums',
                          complete ? 'text-primary' : active ? 'text-foreground' : 'num-stroke',
                        )}
                        style={{ fontSize: '1.6rem' }}
                      >
                        {complete ? <Check className="h-6 w-6" /> : String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-medium uppercase leading-snug tracking-tight">
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
            {showCongrats && (
              <div className="mb-10">
                <Notice tone="success">
                  <span className="flex items-center gap-2">
                    <PartyPopper className="h-5 w-5 shrink-0" />
                    Təbriklər — bütün dərsləri tamamladın.
                  </span>
                </Notice>
              </div>
            )}

            {lesson && (
              <>
                <p className="text-[11px] font-light uppercase tracking-[0.2em] text-muted-foreground">
                  Dərs {activeIndex + 1} / {total}
                </p>
                <h2
                  className="display-gradient mt-4 font-display font-extrabold uppercase leading-[0.98] tracking-tighter"
                  style={{ fontSize: 'clamp(1.6rem, 4.5vw, 3rem)' }}
                >
                  {lesson.title}
                </h2>

                {/* Video yeri — nümunədə boş çərçivə göstərilir, saxta player yox. */}
                <div className="mt-9 overflow-hidden rounded-[24px] bg-secondary/50 ring-1 ring-inset ring-foreground/10 sm:rounded-[32px]">
                  <div className="flex aspect-video items-center justify-center px-8 text-center">
                    <p className="max-w-sm text-sm font-light leading-relaxed text-muted-foreground">
                      Real təlimlərdə burada Google Drive videosu oynayır. Nümunə panelində
                      video yerləşdirilmir.
                    </p>
                  </div>
                </div>

                {lesson.description && (
                  <p
                    className="mt-8 max-w-2xl font-light leading-relaxed text-foreground/75"
                    style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}
                  >
                    {lesson.description}
                  </p>
                )}

                <div className="mt-12 flex flex-col gap-5 border-t border-foreground/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    size="lg"
                    variant={isDone ? 'outline' : 'primary'}
                    onClick={toggleComplete}
                  >
                    <Check className="h-5 w-5" />
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
    </div>
  )
}

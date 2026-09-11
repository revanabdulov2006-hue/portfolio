import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { fetchPublishedCourses } from '@/lib/queries'
import { isSupabaseConfigured } from '@/lib/supabase'
import { CATEGORY_LABELS, type Course, type CourseCategory } from '@/types/db'
import { Reveal } from '@/components/motion/Reveal'
import { Spinner } from '@/components/ui/field'
import { cn } from '@/lib/utils'

const FILTERS: { id: CourseCategory | 'hamisi'; label: string }[] = [
  { id: 'hamisi', label: 'Hamısı' },
  { id: 'marketinq', label: CATEGORY_LABELS.marketinq },
  { id: 'ai', label: CATEGORY_LABELS.ai },
  { id: 'satis', label: CATEGORY_LABELS.satis },
  { id: 'dropshipping', label: CATEGORY_LABELS.dropshipping },
]

export default function Courses() {
  const [courses, setCourses] = useState<Course[] | null>(null)
  const [filter, setFilter] = useState<CourseCategory | 'hamisi'>('hamisi')

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setCourses([])
      return
    }

    let active = true
    fetchPublishedCourses()
      .then((c) => active && setCourses(c))
      .catch(() => {
        // Xəta halında da "hələ təlim yoxdur" vəziyyəti göstərilir — istifadəçiyə
        // texniki səbəb sızmır.
        if (active) setCourses([])
      })
    return () => {
      active = false
    }
  }, [])

  const comingSoon = courses !== null && courses.length === 0

  const { free, paid } = useMemo(() => {
    const visible = courses?.filter((c) => filter === 'hamisi' || c.category === filter) ?? []
    return {
      free: visible.filter((c) => c.is_free),
      paid: visible.filter((c) => !c.is_free),
    }
  }, [courses, filter])

  const total = free.length + paid.length

  return (
    <div className="pb-32 pt-28 sm:pt-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h1
            className="display-gradient text-center font-display font-extrabold uppercase leading-none tracking-tighter"
            style={{ fontSize: 'clamp(2.8rem, 13vw, 170px)' }}
          >
            Təlimlər
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-8 max-w-xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
            Pulsuz təlimlərə dərhal başlaya bilərsən. Pullu təlimlər üçün WhatsApp üzərindən
            əlaqə saxlayırıq.
          </p>
        </Reveal>

        {!comingSoon && (
          <Reveal delay={200}>
            <div className="mt-12 flex flex-wrap justify-center gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  aria-pressed={filter === f.id}
                  className={cn(
                    'rounded-full border px-5 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors sm:text-sm',
                    filter === f.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        <div className="mt-16 sm:mt-20">
          {!courses && (
            <div className="flex justify-center py-24">
              <Spinner className="h-6 w-6 text-primary" />
            </div>
          )}

          {comingSoon && (
            <Reveal>
              <div className="border-y border-border py-24 text-center sm:py-32">
                <p
                  className="display-gradient font-display font-extrabold uppercase leading-none tracking-tighter"
                  style={{ fontSize: 'clamp(2.2rem, 9vw, 110px)' }}
                >
                  Tezliklə
                </p>
                <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Təlimlər üzərində işləyirik. Hazır olan kimi bura əlavə olunacaq.
                </p>
              </div>
            </Reveal>
          )}

          {courses && courses.length > 0 && total === 0 && (
            <div className="border-y border-border py-24 text-center">
              <p className="font-display text-xl font-bold uppercase tracking-tight">
                Bu kateqoriyada təlim yoxdur
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Başqa kateqoriyaya bax və ya tezliklə yenidən yoxla.
              </p>
            </div>
          )}

          {courses && total > 0 && (
            <div className="space-y-24 sm:space-y-32">
              <CourseGroup
                label="Pulsuz"
                note="Qeydiyyatdan sonra dərhal açılır"
                courses={free}
                startIndex={1}
              />
              <CourseGroup
                label="Pullu"
                note="Ödəniş WhatsApp üzərindən həll olunur"
                courses={paid}
                startIndex={free.length + 1}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Bir qrup (Pulsuz / Pullu). Qrup başlığı blokun ÜSTÜNDƏ dayanır və
 * sürüşdürəndə naviqasiyanın altına yapışır — uzun siyahıda hansı blokda
 * olduğun həmişə görünür.
 */
function CourseGroup({
  label,
  note,
  courses,
  startIndex,
}: {
  label: string
  note: string
  courses: Course[]
  startIndex: number
}) {
  if (courses.length === 0) return null

  return (
    <section>
      {/*
        Qəsdən Reveal-ə sarınmır: sarğı div sticky elementi öz hündürlüyü ilə
        məhdudlaşdırar, Reveal-in qoyduğu filter/transform isə həm yapışqan
        davranışı, həm də backdrop-blur-u riskə atar.
      */}
      <header className="sticky top-16 z-30 -mx-5 flex items-end justify-between gap-6 border-b border-foreground/20 bg-background/85 px-5 pb-4 pt-4 backdrop-blur-md sm:-mx-8 sm:px-8 md:top-20">
        <div className="flex items-baseline gap-4 sm:gap-6">
          <span
            className="font-display font-extrabold uppercase leading-none tracking-tighter"
            style={{ fontSize: 'clamp(1.6rem, 5vw, 3.4rem)' }}
          >
            {label}
          </span>
          <span className="hidden text-xs font-light uppercase tracking-[0.18em] text-muted-foreground sm:inline">
            {note}
          </span>
        </div>
        <span className="shrink-0 pb-1 text-xs uppercase tracking-[0.18em] text-muted-foreground tabular-nums">
          {String(courses.length).padStart(2, '0')} təlim
        </span>
      </header>

      <ul>
        {courses.map((c, i) => (
          <Reveal key={c.id} as="li" delay={i * 90}>
            <CourseRow course={c} index={startIndex + i} />
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

function CourseRow({ course, index }: { course: Course; index: number }) {
  const inner = (
    <>
      {/* Hover-də soldan sağa süzülən incə fon */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -inset-x-5 origin-left scale-x-0 bg-foreground/[0.045] transition-transform duration-500 group-hover:scale-x-100 sm:-inset-x-8"
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      />

      <span
        aria-hidden
        className="num-stroke relative shrink-0 font-display font-extrabold leading-none tabular-nums"
        style={{ fontSize: 'clamp(2.4rem, 8vw, 120px)' }}
      >
        {String(index).padStart(2, '0')}
      </span>

      <span className="relative flex min-w-0 flex-1 flex-col gap-2.5 pt-1 sm:gap-3.5">
        <span className="text-[11px] font-light uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
          {CATEGORY_LABELS[course.category]}
        </span>
        <span
          className="font-display font-semibold uppercase leading-tight tracking-tight"
          style={{ fontSize: 'clamp(1rem, 2.2vw, 2rem)' }}
        >
          {course.title}
        </span>
        <span
          className="max-w-2xl font-light leading-relaxed text-foreground/60"
          style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.15rem)' }}
        >
          {course.summary}
        </span>
      </span>

      {/* Sağ sütun — qiymət və ox. Mobil ekranda ox gizlənir, yer qalmır. */}
      <span className="relative flex shrink-0 flex-col items-end gap-3 pt-1 sm:gap-5">
        <span className="text-right">
          <span className="block text-[10px] font-light uppercase tracking-[0.2em] text-muted-foreground">
            {course.is_free ? 'Giriş' : 'Qiymət'}
          </span>
          <span className="mt-1.5 block whitespace-nowrap font-display text-lg font-extrabold uppercase tracking-tight tabular-nums sm:text-2xl">
            {course.is_free ? 'Pulsuz' : `${course.price} ${course.currency}`}
          </span>
        </span>

        <span className="hidden h-11 w-11 items-center justify-center rounded-full border border-foreground/25 transition-[background-color,border-color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:border-transparent group-hover:bg-foreground group-hover:text-background sm:flex">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </span>
    </>
  )

  const shell =
    'group relative flex items-start gap-4 border-b border-foreground/15 py-8 sm:gap-8 sm:py-10 md:gap-12 md:py-12'

  // Nümunə sətirlərin də arxasında indi tam səhifə var — CourseDetail
  // nümunə slug-ını tanıyır və məzmunu sampleCourses-dan götürür.
  return (
    <Link to={`/telimler/${course.slug}`} className={shell}>
      {inner}
    </Link>
  )
}

import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, MessageCircle, PlayCircle } from 'lucide-react'
import {
  createCourseRequest,
  enrollFree,
  fetchCourseBySlug,
  fetchCourseOutline,
  hasEnrollment,
  logCourseView,
} from '@/lib/queries'
import { isSupabaseConfigured } from '@/lib/supabase'
import { getSampleCourse } from '@/content/sampleCourses'
import { friendlyErrorMessage } from '@/lib/errors'
import { CATEGORY_LABELS, type Course } from '@/types/db'
import { useAuth } from '@/context/AuthContext'
import { whatsappOrderLink } from '@/config/site'
import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/button'
import { Notice, Spinner } from '@/components/ui/field'

export default function CourseDetail() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()

  const [course, setCourse] = useState<Course | null>(null)
  const [outline, setOutline] = useState<{ title: string }[]>([])
  const [enrolled, setEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  /*
   * Nümunə rejimi: slug nümunə təlimə uyğun gəlirsə məzmun bazadan yox,
   * sampleCourses-dan gəlir. Beləcə .env olmadan da bütün funnel — siyahı →
   * detal → dərs paneli — işlək qalır və dizayn real məzmunla görünür.
   */
  const sample = getSampleCourse(slug)
  const isSample = Boolean(sample) && (!isSupabaseConfigured || !course)

  useEffect(() => {
    let active = true

    if (sample && !isSupabaseConfigured) {
      setCourse(sample)
      setOutline(sample.lessons.map((l) => ({ title: l.title })))
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    ;(async () => {
      try {
        const c = await fetchCourseBySlug(slug)
        if (!active) return

        if (!c) {
          // Bazada yoxdursa, nümunə ola bilər.
          if (sample) {
            setCourse(sample)
            setOutline(sample.lessons.map((l) => ({ title: l.title })))
          } else {
            setError('Bu təlim tapılmadı.')
          }
          setLoading(false)
          return
        }

        setCourse(c)
        const [plan, isEnrolled] = await Promise.all([
          fetchCourseOutline(slug).catch(() => []),
          user ? hasEnrollment(user.id, c.id) : Promise.resolve(false),
        ])
        if (!active) return
        setOutline(plan)
        setEnrolled(isEnrolled)
        void logCourseView(c.id, user?.id ?? null)
      } catch {
        if (!active) return
        // Şəbəkə/baza xətası: nümunə varsa səhifə yenə də açılır.
        if (sample) {
          setCourse(sample)
          setOutline(sample.lessons.map((l) => ({ title: l.title })))
        } else {
          setError('Bu təlim yüklənmədi.')
        }
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, user])

  async function startFree() {
    if (!course) return

    // Nümunə təlimdə qeydiyyat tələb olunmur — birbaşa demo panelə.
    if (isSample) {
      navigate(`/telimler/${slug}/izle`)
      return
    }

    if (!user) {
      navigate('/giris', { state: { from: `/telimler/${slug}` } })
      return
    }
    setBusy(true)
    try {
      await enrollFree(user.id, course.id)
      navigate(`/telimlerim/${course.slug}`)
    } catch {
      setError(friendlyErrorMessage())
    } finally {
      setBusy(false)
    }
  }

  async function orderPaid() {
    if (!course) return

    if (isSample) {
      setNotice(
        'Bu nümunə təlimdir — real sifariş qeydə alınmır. Real təlimlərdə bu düymə ' +
          'adminə sorğu yazır və WhatsApp pəncərəsini açır.',
      )
      return
    }

    if (!user) {
      navigate('/giris', { state: { from: `/telimler/${slug}` } })
      return
    }

    setBusy(true)
    try {
      // Əvvəlcə adminə sorğu qeydi düşür, sonra WhatsApp açılır.
      await createCourseRequest({
        userId: user.id,
        courseId: course.id,
        fullName: profile?.full_name ?? '',
        email: profile?.email ?? user.email ?? '',
      })
      setNotice(
        'Sorğun qeydə alındı. WhatsApp pəncərəsi açılır — ödəniş orada həll olunacaq. ' +
          'Təsdiqdən sonra təlim "Mənim təlimlərim" bölməsində görünəcək.',
      )
      window.open(whatsappOrderLink(course.title), '_blank', 'noopener,noreferrer')
    } catch {
      setError(friendlyErrorMessage())
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-6 w-6 text-primary" />
      </div>
    )
  }

  if (error && !course) {
    return (
      <div className="mx-auto max-w-xl px-5 pb-24 pt-32 text-center">
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight">{error}</h1>
        <Link to="/telimler" className="mt-6 inline-block text-primary hover:underline">
          Bütün təlimlərə qayıt
        </Link>
      </div>
    )
  }

  if (!course) return null

  const priceLabel = course.is_free ? 'Pulsuz' : `${course.price} ${course.currency}`

  return (
    <div className="pb-32 pt-28 sm:pt-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Link
          to="/telimler"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Bütün təlimlər
        </Link>

        {/* Başlıq bloku — Təlimlər səhifəsi ilə eyni tipoqrafik dil */}
        <header className="mt-10 border-b border-foreground/15 pb-10 sm:mt-14 sm:pb-14">
          <Reveal>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-light uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
              <span>{CATEGORY_LABELS[course.category]}</span>
              <span aria-hidden>·</span>
              <span>{course.is_free ? 'Pulsuz' : 'Pullu'}</span>
              {outline.length > 0 && (
                <>
                  <span aria-hidden>·</span>
                  <span className="tabular-nums">{outline.length} dərs</span>
                </>
              )}
            </div>
          </Reveal>

          <Reveal delay={60}>
            <h1
              className="display-gradient mt-6 font-display font-extrabold uppercase leading-[0.95] tracking-tighter"
              style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}
            >
              {course.title}
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p
              className="mt-7 max-w-2xl font-light leading-relaxed text-foreground/65"
              style={{ fontSize: 'clamp(0.95rem, 1.7vw, 1.25rem)' }}
            >
              {course.summary}
            </p>
          </Reveal>
        </header>

        {isSample && (
          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
            Nümunə təlim — real təlimlər dərc olunan kimi əvəzlənəcək
          </p>
        )}

        <div className="mt-12 grid gap-14 lg:mt-16 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          {/* ---- Sol sütun ---- */}
          <div>
            {course.thumbnail_url && (
              <Reveal delay={160}>
                <img
                  src={course.thumbnail_url}
                  alt=""
                  className="aspect-[16/9] w-full rounded-[28px] object-cover sm:rounded-[40px]"
                />
              </Reveal>
            )}

            {course.description && (
              <Reveal delay={180}>
                <section className={course.thumbnail_url ? 'mt-14' : ''}>
                  <h2 className="text-[11px] font-light uppercase tracking-[0.2em] text-muted-foreground">
                    Təlim haqqında
                  </h2>
                  <div className="mt-6 space-y-5">
                    {course.description
                      .split('\n')
                      .filter(Boolean)
                      .map((p, i) => (
                        <p
                          key={i}
                          className="max-w-2xl font-light leading-relaxed text-foreground/75"
                          style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}
                        >
                          {p}
                        </p>
                      ))}
                  </div>
                </section>
              </Reveal>
            )}

            {course.learn_points.length > 0 && (
              <Reveal delay={200}>
                <section className="mt-16">
                  <h2 className="text-[11px] font-light uppercase tracking-[0.2em] text-muted-foreground">
                    Bu təlimdə nə öyrənəcəksən
                  </h2>
                  <ul className="mt-6 border-t border-foreground/15">
                    {course.learn_points.map((p, i) => (
                      <li
                        key={i}
                        className="flex gap-4 border-b border-foreground/15 py-5 sm:gap-5"
                      >
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span
                          className="font-light leading-relaxed text-foreground/85"
                          style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)' }}
                        >
                          {p}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            )}

            {outline.length > 0 && (
              <Reveal delay={220}>
                <section className="mt-16">
                  <h2 className="text-[11px] font-light uppercase tracking-[0.2em] text-muted-foreground">
                    Məzmun planı
                  </h2>
                  <ol className="mt-6 border-t border-foreground/15">
                    {outline.map((l, i) => (
                      <li
                        key={i}
                        className="group flex items-center gap-5 border-b border-foreground/15 py-5 sm:gap-7"
                      >
                        <span
                          aria-hidden
                          className="num-stroke shrink-0 font-display font-extrabold leading-none tabular-nums"
                          style={{ fontSize: 'clamp(1.5rem, 4vw, 2.75rem)' }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className="font-display font-semibold uppercase leading-tight tracking-tight"
                          style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.35rem)' }}
                        >
                          {l.title}
                        </span>
                      </li>
                    ))}
                  </ol>
                </section>
              </Reveal>
            )}
          </div>

          {/* ---- Sağ sütun — əməliyyat paneli ---- */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal delay={100}>
              <div className="border-t-2 border-foreground/25 pt-7">
                <p className="text-[10px] font-light uppercase tracking-[0.2em] text-muted-foreground">
                  {course.is_free ? 'Giriş' : 'Qiymət'}
                </p>
                <p
                  className="mt-2 font-display font-extrabold uppercase leading-none tracking-tighter tabular-nums"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
                >
                  {priceLabel}
                </p>

                {notice && (
                  <div className="mt-6">
                    <Notice tone="info">{notice}</Notice>
                  </div>
                )}
                {error && (
                  <div className="mt-6">
                    <Notice tone="error">{error}</Notice>
                  </div>
                )}

                <div className="mt-7">
                  {enrolled ? (
                    <Link to={`/telimlerim/${course.slug}`}>
                      <Button size="lg" className="w-full">
                        <PlayCircle className="h-5 w-5" />
                        Təlimə davam et
                      </Button>
                    </Link>
                  ) : course.is_free ? (
                    <Button size="lg" className="w-full" onClick={startFree} disabled={busy}>
                      {busy ? <Spinner /> : <PlayCircle className="h-5 w-5" />}
                      İndi başla
                    </Button>
                  ) : (
                    <Button size="lg" className="w-full" onClick={orderPaid} disabled={busy}>
                      {busy ? <Spinner /> : <MessageCircle className="h-5 w-5" />}
                      WhatsApp-dan sifariş et
                    </Button>
                  )}
                </div>

                <p className="mt-6 text-xs font-light leading-relaxed text-muted-foreground">
                  {course.is_free
                    ? 'Pulsuz təlimlər dərhal açılır, təsdiq gözləmirsən.'
                    : 'Ödəniş WhatsApp üzərindən həll olunur. Saytda kart məlumatı istənmir. Təsdiqdən sonra təlim hesabında açılır.'}
                </p>

                {!user && !isSample && (
                  <p className="mt-5 border-t border-foreground/15 pt-5 text-xs text-muted-foreground">
                    Davam etmək üçün{' '}
                    <Link to="/giris" className="text-primary hover:underline">
                      hesabına daxil ol
                    </Link>
                    .
                  </p>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  )
}

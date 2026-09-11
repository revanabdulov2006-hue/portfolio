import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { works, type Work } from '@/content/landing'

const RADIUS = 'rounded-[32px] sm:rounded-[44px] md:rounded-[56px]'

function WorkCard({ work, index, total }: { work: Work; index: number; total: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  })

  // Yığında aşağıda qalan kart daha kiçik ölçüdə oturur ki, üstündəkinin
  // arxasından bir zolaq kimi görünsün.
  const targetScale = 1 - (total - 1 - index) * 0.03
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale])

  return (
    <div
      ref={containerRef}
      className="sticky top-24 flex h-[78vh] items-start justify-center md:top-32"
    >
      <motion.article
        style={{ scale, top: `${index * 26}px` }}
        className={`relative flex w-full flex-col gap-5 border-2 border-border bg-card p-4 sm:gap-6 sm:p-6 md:p-8 ${RADIUS}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <span
              className="display-gradient font-display font-extrabold leading-none tabular-nums"
              style={{ fontSize: 'clamp(2.6rem, 9vw, 120px)' }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-widest text-muted-foreground sm:text-sm">
                {work.field}
              </span>
              <h3
                className="font-display font-semibold uppercase leading-tight tracking-tight"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2rem)' }}
              >
                {work.title}
              </h3>
            </div>
          </div>

          {work.href && (
            <a
              href={work.href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border-2 border-foreground/70 px-6 py-3 text-sm font-medium uppercase tracking-widest transition-colors hover:bg-foreground/10 sm:px-8"
            >
              Sayta bax
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>

        {work.image ? (
          /* Ekran görüntüsüdür — kəsilsə rəqəmlər itər, ona görə `contain`. */
          <img
            src={work.image}
            alt={work.title}
            loading="lazy"
            className={`w-full bg-secondary/60 object-contain p-3 sm:p-5 ${RADIUS}`}
            /*
              Portret şəkil geniş ekran görüntüsündən hündür olmalıdır, amma
              kart yığını `h-[78vh]` yuvalarda oturur — hədd aşılsa, kart öz
              yuvasından daşıb aşağıdakı bölmənin üstünə düşür.
            */
            style={{
              height: work.tall ? 'clamp(240px, 34vw, 430px)' : 'clamp(180px, 32vw, 420px)',
            }}
          />
        ) : (
          /* Şəkil yoxdursa saxta görüntü qoyulmur — mətn paneli göstərilir. */
          <div
            className={`flex items-center bg-secondary/60 px-6 py-10 sm:px-10 md:px-14 ${RADIUS}`}
            style={{ minHeight: 'clamp(180px, 26vw, 340px)' }}
          >
            <p
              className="max-w-3xl font-light leading-relaxed text-foreground/75"
              style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.5rem)' }}
            >
              {work.summary}
            </p>
          </div>
        )}

        {/* Şəkil varsa izah mətn panelində görünmür — altda verilir. */}
        {work.image && (
          <p className="max-w-3xl font-light leading-relaxed text-foreground/75 sm:text-lg">
            {work.summary}
          </p>
        )}
      </motion.article>
    </div>
  )
}

export function Works() {
  if (works.length === 0) return null

  return (
    <section
      id="isler"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-background px-5 pb-28 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:pt-32"
    >
      <Reveal>
        <h2
          className="display-gradient text-center font-display font-extrabold uppercase leading-none tracking-tighter"
          style={{ fontSize: 'clamp(2.6rem, 11vw, 150px)' }}
        >
          İşlərim
        </h2>
      </Reveal>

      <div className="mx-auto mt-16 max-w-6xl sm:mt-20 md:mt-28">
        {works.map((w, i) => (
          <WorkCard key={w.id} work={w} index={i} total={works.length} />
        ))}
      </div>
    </section>
  )
}

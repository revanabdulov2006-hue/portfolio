import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { ScrollRevealText } from '@/components/motion/ScrollRevealText'
import { Button } from '@/components/ui/button'
import { about, closing } from '@/content/landing'

/** Dörd küncdəki dekorativ mavi işıq ləkələri — şəkil deyil, saf CSS. */
const GLOWS = [
  { className: 'left-[2%] top-[8%] h-40 w-40 md:h-64 md:w-64', delay: 0 },
  { className: 'right-[2%] top-[6%] h-36 w-36 md:h-56 md:w-56', delay: 120 },
  { className: 'bottom-[10%] left-[6%] h-32 w-32 md:h-52 md:w-52', delay: 200 },
  { className: 'bottom-[8%] right-[5%] h-44 w-44 md:h-64 md:w-64', delay: 280 },
]

export function About() {
  return (
    <section
      id="haqqimda"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-24 sm:px-8"
    >
      {GLOWS.map((g, i) => (
        <div
          key={i}
          aria-hidden
          className={`pointer-events-none absolute rounded-full bg-primary/20 blur-3xl ${g.className}`}
        />
      ))}

      <div className="relative z-10 flex w-full flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <Reveal>
            <h2
              className="display-gradient text-center font-display font-extrabold uppercase leading-none tracking-tighter"
              style={{ fontSize: 'clamp(3rem, 12vw, 150px)' }}
            >
              {about.eyebrow}
            </h2>
          </Reveal>

          <ScrollRevealText
            text={about.body.join(' ')}
            className="max-w-[600px] text-center font-medium leading-relaxed text-foreground"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
        </div>

        <Reveal delay={120}>
          <Link to="/telimler" className="inline-block">
            <Button variant="gradient" size="lg" className="text-xs sm:text-sm md:text-base">
              {closing.cta}
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

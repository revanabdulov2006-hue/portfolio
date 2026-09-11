import { Link } from 'react-router-dom'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { PortraitPortal } from '@/components/landing/PortraitPortal'
import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/button'
import { hero } from '@/content/landing'

/**
 * Hero — nəhəng qradiyent ad, arxasında maqnitli portret.
 * Mobil: ad iki sətirdə, portret mərkəzdə.
 * Masaüstü: ad tək sətirdə, portret aşağı bağlanır.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden pt-16">
      {/* Yumşaq mavi işıq — tünd fonda dərinlik verir */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(58% 50% at 50% 34%, hsl(var(--accent) / 0.75) 0%, transparent 72%)',
        }}
      />

      {/* Ad */}
      <div className="relative z-20 overflow-hidden px-4">
        <Reveal>
          <h1 className="display-gradient text-center font-display font-extrabold uppercase leading-[0.82] tracking-tighter">
            <span className="block whitespace-nowrap text-[19vw] md:inline md:text-[10.5vw]">
              {hero.firstName}
            </span>{' '}
            <span className="block whitespace-nowrap text-[13.5vw] md:inline md:text-[10.5vw]">
              {hero.lastName}
            </span>
          </h1>
        </Reveal>
      </div>

      {/*
        Yerləşdirmə xarici div-də saxlanır: Reveal transform-u inline style ilə
        idarə edir, ona görə -translate-x-1/2 kimi siniflər onun üzərində işləməzdi.
      */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[270px] -translate-x-1/2 -translate-y-1/2 sm:bottom-0 sm:top-auto sm:w-[360px] sm:translate-y-0 md:w-[450px] lg:w-[530px]">
        <Reveal delay={220}>
          {/*
            Portret qəsdən Magnet-ə sarınmır — kursoru izləmir, yerində qalır.
            Yeganə interaktivlik portaldır: kursorun altında arxadakı real
            foto açılır.

            Aşağı sönmə portalın XARİCİNDƏ dayanır: iki maska iç-içə təbii
            kompozisiya olunur, `mask-composite` işlətməyə ehtiyaç qalmır.
            Sönmə çiyinlərin kəsik xəttini gizlədir.
          */}
          <div
            className="drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
            style={{
              maskImage: 'linear-gradient(to bottom, #000 88%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, #000 88%, transparent 100%)',
            }}
          >
            <PortraitPortal />
          </div>
        </Reveal>
      </div>

      {/* Alt sətir — mövqeləndirmə + əsas CTA */}
      <div className="relative z-20 mt-auto flex items-end justify-between gap-6 px-5 pb-16 sm:px-8 sm:pb-20 md:pb-24">
        <Reveal delay={340}>
          <p
            className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-foreground/85 sm:max-w-[220px] md:max-w-[280px]"
            style={{ fontSize: 'clamp(0.75rem, 1.3vw, 1.35rem)' }}
          >
            {hero.standfirst}
          </p>
        </Reveal>

        <Reveal delay={460}>
          <Link to="/telimler" className="inline-block">
            <Button variant="gradient" size="lg" className="text-xs sm:text-sm md:text-base">
              {hero.cta}
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </Reveal>
      </div>

      <a
        href="#haqqimda"
        aria-label="Aşağı sürüşdür"
        className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 text-muted-foreground transition-colors hover:text-primary"
      >
        <ChevronDown className="h-5 w-5 animate-bounce md:h-7 md:w-7" />
      </a>
    </section>
  )
}

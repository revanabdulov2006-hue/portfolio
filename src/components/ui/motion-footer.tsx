import * as React from 'react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUp, Mail, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/config/site'
import { marqueeRowOne } from '@/content/landing'

/*
 * Kinematik footer — bu layihə üçün uyğunlaşdırılmış versiya.
 *
 * Orijinal snippet-dən əsas fərq: bütün effektlər
 * `color-mix(in oklch, var(--foreground) 3%, transparent)` üzərində qurulmuşdu.
 * Bu layihədə tokenlər tam rəng deyil, HSL ÜÇLÜYÜDÜR (`--foreground: 206 31% 88%`),
 * ona görə `var(--foreground)` color-mix üçün etibarsız dəyərdir və pill fonları,
 * grid, aurora, nəhəng mətn — hamısı görünməz qalardı. Hamısı `hsl(var(--token) / a)`
 * formasına çevrilib. Stillər `index.css`-dədir (hər mount-da inject olunmasın).
 */

gsap.registerPlugin(ScrollTrigger)

// ---------------------------------------------------------------------------
// Maqnit düymə
// ---------------------------------------------------------------------------
export type MagneticProps = {
  as?: React.ElementType
  className?: string
  children: React.ReactNode
} & Record<string, unknown>

export function Magnetic({ as: Tag = 'button', className, children, ...rest }: MagneticProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const x = e.clientX - r.left - r.width / 2
      const y = e.clientY - r.top - r.height / 2
      gsap.to(el, {
        x: x * 0.35,
        y: y * 0.35,
        scale: 1.04,
        ease: 'power2.out',
        duration: 0.4,
      })
    }
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, scale: 1, ease: 'elastic.out(1, 0.4)', duration: 1.1 })
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      gsap.killTweensOf(el)
    }
  }, [])

  return (
    <Tag ref={ref} className={cn('cursor-pointer', className)} {...rest}>
      {children}
    </Tag>
  )
}

/** lucide v1-də brend ikonları yoxdur — Instagram qlifi inline verilir. */
const InstagramGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5 text-muted-foreground"
    aria-hidden
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.822a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)

// ---------------------------------------------------------------------------
const MarqueeRow = () => (
  <div className="flex items-center gap-12 px-6">
    {marqueeRowOne.map((w) => (
      <React.Fragment key={w}>
        <span>{w}</span>
        <span className="text-primary/60" aria-hidden>
          ✦
        </span>
      </React.Fragment>
    ))}
  </div>
)

export function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const giantRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapperRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantRef.current,
        { y: '10vh', scale: 0.85, opacity: 0 },
        {
          y: '0vh',
          scale: 1,
          opacity: 1,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top 80%',
            end: 'bottom bottom',
            scrub: 1,
          },
        },
      )

      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top 45%',
            end: 'bottom bottom',
            scrub: 1,
          },
        },
      )
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  const year = new Date().getFullYear()
  const wa = `https://wa.me/${siteConfig.whatsappNumber}`

  return (
    /*
      "Pərdə" texnikası: sarğı adi axındadır və clip-path ilə öz qutusunu
      kəsir; footer isə viewport-a bərkidilib, ona görə scroll etdikcə
      arxadan açılırmış kimi görünür.
    */
    <div
      ref={wrapperRef}
      className="relative h-screen w-full"
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
    >
      <footer className="cinematic-footer fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-background text-foreground">
        <div className="footer-aurora pointer-events-none absolute left-1/2 top-1/2 z-0 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px]" />
        <div className="footer-bg-grid pointer-events-none absolute inset-0 z-0" />

        <div
          ref={giantRef}
          aria-hidden
          className="footer-giant-text pointer-events-none absolute bottom-[22vh] left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap md:bottom-[26vh]"
        >
          RƏVAN ABDULZADƏ
        </div>

        {/* Diaqonal marquee */}
        <div className="absolute left-0 top-16 z-10 w-full -rotate-2 scale-110 overflow-hidden border-y border-border/60 bg-background/60 py-4 backdrop-blur-md">
          <div className="flex w-max animate-footer-marquee text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground md:text-sm">
            <MarqueeRow />
            <MarqueeRow />
          </div>
        </div>

        {/* Mərkəz */}
        <div className="relative z-10 mx-auto mt-24 flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6">
          <h2
            ref={headingRef}
            className="footer-heading text-center font-display font-black uppercase leading-[0.95] tracking-tighter"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
          >
            Başlamağa hazırsan?
          </h2>

          <div ref={linksRef} className="mt-12 flex w-full flex-col items-center gap-5">
            {/*
              Pill-lərin üstündə etiket deyil, ÜNVANIN ÖZÜ yazılır — ziyarətçi
              linkə basmadan da nömrəni/hesabı oxuya və köçürə bilsin.
            */}
            <div className="flex w-full flex-wrap justify-center gap-3 md:gap-4">
              <Magnetic
                as="a"
                href={wa}
                target="_blank"
                rel="noreferrer noopener"
                className="footer-pill flex items-center gap-3 rounded-full px-7 py-4 text-sm font-bold md:px-9 md:py-5 md:text-base"
              >
                <MessageCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
                <span>
                  WhatsApp
                  <span className="mx-2 text-muted-foreground" aria-hidden>
                    ·
                  </span>
                  <span className="tabular-nums">{siteConfig.whatsappDisplay}</span>
                </span>
              </Magnetic>

              {siteConfig.social.instagram && (
                <Magnetic
                  as="a"
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="footer-pill flex items-center gap-3 rounded-full px-7 py-4 text-sm font-bold md:px-9 md:py-5 md:text-base"
                >
                  <InstagramGlyph />
                  <span>
                    Instagram
                    <span className="mx-2 text-muted-foreground" aria-hidden>
                      ·
                    </span>
                    {siteConfig.social.instagramHandle}
                  </span>
                </Magnetic>
              )}

              <Magnetic
                as="a"
                href={`mailto:${siteConfig.contactEmail}`}
                className="footer-pill flex items-center gap-3 rounded-full px-7 py-4 text-xs font-bold md:px-9 md:py-5 md:text-base"
              >
                <Mail className="h-5 w-5 shrink-0 text-muted-foreground" />
                <span className="break-all">{siteConfig.contactEmail}</span>
              </Magnetic>
            </div>

            <div className="mt-2 flex w-full flex-wrap justify-center gap-3 md:gap-5">
              <Magnetic
                as={Link}
                to="/telimler"
                className="footer-pill rounded-full px-6 py-3 text-xs font-medium text-muted-foreground hover:text-foreground md:text-sm"
              >
                Təlimlər
              </Magnetic>
              <Magnetic
                as={Link}
                to="/mexfilik-siyaseti"
                className="footer-pill rounded-full px-6 py-3 text-xs font-medium text-muted-foreground hover:text-foreground md:text-sm"
              >
                Məxfilik siyasəti
              </Magnetic>
            </div>
          </div>
        </div>

        {/* Alt sətir */}
        <div className="relative z-20 flex w-full flex-col items-center justify-between gap-6 px-6 pb-8 md:flex-row md:px-12">
          <div className="order-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground md:order-1 md:text-xs">
            © {year} {siteConfig.name}
          </div>

          <div className="footer-pill order-1 flex cursor-default items-center gap-2 rounded-full px-6 py-3 md:order-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Marketinq · AI · Satış · Dropshipping
            </span>
          </div>

          <Magnetic
            as="button"
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Yuxarı qayıt"
            className="footer-pill group order-3 flex h-12 w-12 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
          >
            <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1.5" />
          </Magnetic>
        </div>
      </footer>
    </div>
  )
}

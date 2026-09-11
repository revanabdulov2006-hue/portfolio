import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

/*
 * "Sterling Gate" kinetik naviqasiyası — bu layihə üçün uyğunlaşdırılmış versiya.
 *
 * Orijinal snippet-dən fərqlər:
 *  - Məzmun sabit kodlanmır, prop kimi gəlir (real route-lar, real auth).
 *  - Stil Tailwind ilə yazılır: snippet ~40 sinifə istinad edirdi, amma
 *    onların CSS-i verilmirdi.
 *  - `gsap.defaults()` QLOBAL çağırılmır — dəyərlər birbaşa timeline-a verilir
 *    ki, layihənin başqa yerlərinə sızmasın.
 *  - Hover dinləyiciləri elementin üzərinə `_cleanup` kimi yapışdırılmır.
 *
 * VACİB — menyu `<body>`-yə PORTAL ilə qoyulur.
 * Naviqasiya `<header>`-in içindən render olunur, header isə scroll edilən kimi
 * `backdrop-blur-xl` alır. CSS-də `backdrop-filter` (eynilə `filter`/`transform`
 * kimi) elementi `position: fixed` nəsilləri üçün containing block-a çevirir —
 * yəni `fixed inset-0` viewport-a yox, 64px-lik header zolağına görə hesablanır
 * və menyu həmin zolağa sıxılırdı. Səhifənin başında (blur yoxdur) işləyir,
 * bir az aşağı sürüşdükdə isə açılmırdı. Portal bu asılılığı tamamilə kəsir.
 */

gsap.registerPlugin(CustomEase)

/** Snippet-dəki easing əyrisi. Modul səviyyəsində bir dəfə qeydiyyatdan keçir. */
const EASE = 'sterlingMain'
if (!gsap.parseEase(EASE)) {
  CustomEase.create(EASE, '0.65, 0.01, 0.05, 0.99')
}

/** Açılış ~0.7s-ə tamamlanır. Əvvəlki 0.7 + geniş stagger ~1.25s çəkirdi. */
const DUR = 0.5

export type KineticLink = {
  to: string
  label: string
  end?: boolean
}

export interface KineticMenuProps {
  open: boolean
  onClose: () => void
  links: KineticLink[]
  /** Sonuncu sətir — Giriş (route) və ya Çıxış (əməliyyat). */
  action: { label: string; to?: string; onClick?: () => void }
}

/**
 * Link hover-ində açılan ambient formalar.
 * Panel indi mavi qradiyentdir — formalar da mavi olsaydı fonda itərdi,
 * ona görə ağın çox aşağı opasiteti istifadə olunur (işıq ləkəsi effekti).
 */
function AmbientShapes() {
  // Dəyərlər primary üçün seçilmişdi; ağ eyni opasitedə çox güclü çıxır.
  const c = (a: number) => `hsl(0 0% 100% / ${(a * 0.45).toFixed(3)})`

  return (
    /* `slice` viewBox-u 400×400-dən tam ekrana böyüdür, ona görə formalar
       çox iri çıxır — opasite və blur onları mətnin arxasında ambient
       dərinlik səviyyəsində saxlayır. */
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-70 blur-[1px]"
      aria-hidden
    >
      <svg
        className="bg-shape bg-shape-0 absolute inset-0 h-full w-full opacity-0"
        viewBox="0 0 400 400"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle className="shape-element" cx="80" cy="120" r="40" fill={c(0.22)} />
        <circle className="shape-element" cx="300" cy="80" r="60" fill={c(0.16)} />
        <circle className="shape-element" cx="200" cy="300" r="80" fill={c(0.12)} />
        <circle className="shape-element" cx="350" cy="280" r="30" fill={c(0.2)} />
      </svg>

      <svg
        className="bg-shape bg-shape-1 absolute inset-0 h-full w-full opacity-0"
        viewBox="0 0 400 400"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          className="shape-element"
          d="M0 200 Q100 100, 200 200 T 400 200"
          stroke={c(0.24)}
          strokeWidth="60"
          fill="none"
        />
        <path
          className="shape-element"
          d="M0 280 Q100 180, 200 280 T 400 280"
          stroke={c(0.16)}
          strokeWidth="40"
          fill="none"
        />
      </svg>

      <svg
        className="bg-shape bg-shape-2 absolute inset-0 h-full w-full opacity-0"
        viewBox="0 0 400 400"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {[50, 150, 250, 350].map((x) => (
          <circle key={`a${x}`} className="shape-element" cx={x} cy="50" r="8" fill={c(0.34)} />
        ))}
        {[100, 200, 300].map((x) => (
          <circle
            key={`b${x}`}
            className="shape-element"
            cx={x}
            cy="150"
            r="12"
            fill={c(0.28)}
          />
        ))}
        {[50, 150, 250, 350].map((x) => (
          <circle
            key={`c${x}`}
            className="shape-element"
            cx={x}
            cy="250"
            r="10"
            fill={c(0.3)}
          />
        ))}
        {[100, 200, 300].map((x) => (
          <circle key={`d${x}`} className="shape-element" cx={x} cy="350" r="6" fill={c(0.3)} />
        ))}
      </svg>

      <svg
        className="bg-shape bg-shape-3 absolute inset-0 h-full w-full opacity-0"
        viewBox="0 0 400 400"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <line
          className="shape-element"
          x1="0"
          y1="100"
          x2="300"
          y2="400"
          stroke={c(0.2)}
          strokeWidth="30"
        />
        <line
          className="shape-element"
          x1="100"
          y1="0"
          x2="400"
          y2="300"
          stroke={c(0.16)}
          strokeWidth="25"
        />
        <line
          className="shape-element"
          x1="200"
          y1="0"
          x2="400"
          y2="200"
          stroke={c(0.12)}
          strokeWidth="20"
        />
      </svg>
    </div>
  )
}

export function KineticMenu({ open, onClose, links, action }: KineticMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  /** Menyu bağlananda fokusun qayıdacağı element (menyunu açan düymə). */
  const openerRef = useRef<Element | null>(null)

  /**
   * Bir link üçün ambient formanı canlandırır. Aşağıdakı effekt doldurur.
   * Toxunma cihazında hover hadisəsi yoxdur, ona görə menyu açılanda da
   * çağırılır — əks halda effekt mobil istifadəçiyə heç vaxt görünməzdi
   * (menyu isə yalnız mobildə açılır).
   */
  const playShape = useRef<(index: number) => void>(() => {})

  /**
   * Açılış timeline-ı BİR DƏFƏ qurulur və `paused` saxlanılır; `open`
   * dəyişəndə yalnız `play()`/`reverse()` çağırılır.
   *
   * Əvvəl hər toggle-da yeni timeline yaradılır, cleanup-da isə `ctx.revert()`
   * çağırılırdı. Revert elementləri tween yaradılan andakı inline stillərə
   * qaytarır — sürətli aç-bağlada bu dəyərlər dövrlər arasında qarışır və menyu
   * bəzən yarımçıq vəziyyətdə qalırdı. Reverse edilə bilən tək timeline həm
   * simmetrik bağlanış verir, həm də yarımçıq animasiyanın üstündən tıklamağa
   * dözür — sadəcə istiqamət dəyişir.
   */
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (still) return

    const ctx = gsap.context(() => {
      const overlay = root.querySelector('.overlay')
      const menu = root.querySelector('.menu-content')
      const panels = root.querySelectorAll('.backdrop-layer')
      const navLinks = root.querySelectorAll('.nav-link-text')

      // Bağlı vəziyyət mount-da animasiyasız qurulur — əvvəl burada 1.4s-lik
      // bağlanış animasiyası boş yerə oynayırdı.
      // Panellər SOL kənardan gəlir (`-101`), sətirlər isə soldan sürüşüb
      // yerinə oturur — menyu tam soldan açılan pərdə kimi oxunur.
      gsap.set(overlay, { autoAlpha: 0 })
      gsap.set(panels, { xPercent: -101 })
      gsap.set(navLinks, { xPercent: -55, autoAlpha: 0 })
      gsap.set(menu, { xPercent: 0 })

      tlRef.current = gsap
        .timeline({ paused: true, defaults: { ease: EASE, duration: DUR } })
        .to(overlay, { autoAlpha: 1 }, 0)
        .to(panels, { xPercent: 0, stagger: 0.06, duration: 0.42 }, 0)
        .to(navLinks, { xPercent: 0, autoAlpha: 1, stagger: 0.045 }, '<+=0.16')
        // Ambient forma animasiya ilə sinxron açılır (əvvəl ayrıca setTimeout idi).
        // Bağlananda timeline geri oynadığı üçün callback yenidən dəyir —
        // görünməyən panel üçün tween başlatmayaq deyə istiqamət yoxlanılır.
        .call(
          () => {
            if (!tlRef.current?.reversed()) playShape.current(0)
          },
          undefined,
          0.2,
        )
    }, rootRef)

    return () => {
      tlRef.current = null
      ctx.revert()
    }
  }, [links.length])

  useEffect(() => {
    const tl = tlRef.current
    if (!tl) return
    if (open) tl.play()
    else tl.reverse()
  }, [open])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cleanups: (() => void)[] = []

    const ctx = gsap.context(() => {
      const enter = (index: number) => {
        const shape = root.querySelector(`.bg-shape-${index}`)
        if (!shape) return
        root.querySelectorAll('.bg-shape').forEach((s) => {
          if (s !== shape) gsap.set(s, { autoAlpha: 0 })
        })
        gsap.set(shape, { autoAlpha: 1 })
        gsap.fromTo(
          shape.querySelectorAll('.shape-element'),
          { scale: 0.5, opacity: 0, rotation: -10, transformOrigin: '50% 50%' },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'back.out(1.7)',
            overwrite: 'auto',
          },
        )
      }

      playShape.current = enter

      root.querySelectorAll<HTMLElement>('.menu-list-item[data-shape]').forEach((item) => {
        const index = Number(item.dataset.shape)
        const shape = root.querySelector(`.bg-shape-${index}`)
        if (!shape) return

        const onEnter = () => enter(index)
        const onLeave = () => {
          gsap.to(shape.querySelectorAll('.shape-element'), {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            overwrite: 'auto',
            onComplete: () => gsap.set(shape, { autoAlpha: 0 }),
          })
        }

        item.addEventListener('mouseenter', onEnter)
        item.addEventListener('mouseleave', onLeave)
        // Toxunma: barmaq linkə dəyəndə forma açılır, buraxanda qalır.
        item.addEventListener('pointerdown', onEnter)
        cleanups.push(() => {
          item.removeEventListener('mouseenter', onEnter)
          item.removeEventListener('mouseleave', onLeave)
          item.removeEventListener('pointerdown', onEnter)
        })
      })
    }, rootRef)

    return () => {
      cleanups.forEach((fn) => fn())
      ctx.revert()
    }
  }, [links.length])

  // ── Escape + fokus idarəsi ──────────────────────────────────────────────
  useEffect(() => {
    if (!open) return

    openerRef.current = document.activeElement
    // Panel animasiyası başlayandan sonra fokusu ilk linkə ver.
    const t = window.setTimeout(() => firstLinkRef.current?.focus(), 420)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
      // Bağlananda fokus menyunu açan düyməyə qayıdır.
      ;(openerRef.current as HTMLElement | null)?.focus?.()
    }
  }, [open, onClose])

  const rows: { key: string; label: string; node: 'link' | 'button' }[] = [
    ...links.map((l) => ({ key: l.to, label: l.label, node: 'link' as const })),
    {
      key: 'action',
      label: action.label,
      node: action.to ? ('link' as const) : ('button' as const),
    },
  ]

  /*
    Portal — komponent header-in içindən çağırılır, header isə scroll edilən kimi
    `backdrop-filter` alır və `fixed` nəsilləri üçün containing block-a çevrilir.
    `<body>`-yə köçürməklə menyu yenidən viewport-a görə yerləşir.

    Görünürlüyü `display` yox, `invisible` + `pointer-events-none` idarə edir:
    GSAP-ın `display` yazıb-pozması artıq animasiyaya qarışmır.

    `z-[45]` — header (`z-50`) menyunun ÜSTÜNDƏ qalmalıdır, çünki menyunu
    bağlayan düymə oradadır. Header açıqkən şəffaflaşdırılır (Navbar-a bax),
    ona görə menyu paneli onun arxasından da görünür.
  */
  const tree = (
    <div
      ref={rootRef}
      className={`fixed inset-0 z-[45] md:!hidden ${
        open ? '' : 'pointer-events-none invisible'
      }`}
    >
      <div
        className="overlay absolute inset-0 bg-background/90 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />

      <nav
        className="menu-content absolute inset-y-0 left-0 flex w-full flex-col sm:max-w-md"
        role="dialog"
        aria-modal="true"
        aria-label="Naviqasiya"
      >
        {/*
          Üç panel pilləli sürüşür — dərinlik hissi verən əsas jest.
          Sonuncu (görünən) panel mavi qradiyentdir; üstündəki iki panel
          ondan bir az fərqli çalarlardadır ki, sürüşmə anında qatlar
          seçilsin.
        */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="backdrop-layer menu-panel-a absolute inset-0" />
          <div className="backdrop-layer menu-panel-b absolute inset-0" />
          <div className="backdrop-layer menu-panel-c absolute inset-0">
            <AmbientShapes />
          </div>
        </div>

        {/*
          Sətirlər şaquli olaraq ORTADA, üfüqi olaraq solda dayanır.
          `my-auto` yuxarı və aşağı boşluğu bərabər bölür — daxili padding
          verilmir, əks halda siyahı mərkəzdən aşağı sürüşərdi.
        */}
        <ul className="relative my-auto flex flex-col gap-1 px-7">
          {rows.map((row, i) => {
            /*
              Sətirlər normalda AĞ (`text-white`), üstünə gələndə mavi yanır.
              Mavi fon üstündə `text-foreground` tünd temada açıq boz olurdu —
              burada rəng fondan asılı olmadan sabit qalmalıdır, ona görə
              token yox, birbaşa ağ istifadə olunur.
            */
            const shared =
              'nav-link-text menu-link block w-full text-left font-display font-extrabold uppercase leading-[1.05] tracking-tighter text-white'
            const size = { fontSize: 'clamp(2rem, 11vw, 3.25rem)' }

            return (
              <li
                key={row.key}
                className="menu-list-item overflow-hidden py-1.5"
                data-shape={i % 4}
              >
                {row.node === 'link' ? (
                  <NavLink
                    ref={i === 0 ? firstLinkRef : undefined}
                    to={row.key === 'action' ? action.to! : row.key}
                    end={links[i]?.end}
                    onClick={onClose}
                    className={shared}
                    style={size}
                  >
                    {row.label}
                  </NavLink>
                ) : (
                  <button
                    type="button"
                    onClick={action.onClick}
                    className={shared}
                    style={size}
                  >
                    {row.label}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )

  return typeof document === 'undefined' ? tree : createPortal(tree, document.body)
}

/**
 * Menyunu açan düymə — snippet-dəki `Menu`/`Close` mətn yığını və
 * 315° fırlanan artı ikonu.
 *
 * Menyu açıqkən arxa fon mavi qradiyentdir, ona görə düymə ağa keçir;
 * bağlı vəziyyətdə sayt palitrasındakı mətn rəngini alır.
 */
export function KineticMenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={open ? 'Menyunu bağla' : 'Menyunu aç'}
      className={`relative -mr-1 flex items-center gap-2.5 transition-colors duration-300 md:hidden ${
        open ? 'text-white' : ''
      }`}
    >
      <span className="relative block h-[1.05rem] overflow-hidden text-sm font-medium uppercase tracking-wider">
        {/*
          Daxili yığın İKİ sətirdən ibarətdir, ona görə sürüşmə -50%-dir.
          -100% versək yığın tam yuxarı çıxır və heç bir söz görünmür.
        */}
        <span
          className="block transition-transform duration-500"
          style={{
            transform: open ? 'translateY(-50%)' : 'translateY(0)',
            transitionTimingFunction: 'cubic-bezier(0.65, 0.01, 0.05, 0.99)',
          }}
        >
          <span className="block h-[1.05rem] leading-[1.05rem]">Menu</span>
          <span className="block h-[1.05rem] leading-[1.05rem]">Close</span>
        </span>
      </span>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="none"
        className="h-4 w-4 transition-transform duration-500"
        style={{
          transform: open ? 'rotate(315deg)' : 'rotate(0deg)',
          transitionTimingFunction: 'cubic-bezier(0.65, 0.01, 0.05, 0.99)',
        }}
        aria-hidden
      >
        <path d="M7.33333 16L7.33333 0L8.66667 0L8.66667 16L7.33333 16Z" fill="currentColor" />
        <path d="M16 8.66667L0 8.66667L0 7.33333L16 7.33333L16 8.66667Z" fill="currentColor" />
      </svg>
    </button>
  )
}

import { useEffect, useRef } from 'react'

/**
 * Halqa + nöqtə kursoru.
 *
 * Nöqtə kursorun tam üstündədir — heç bir gecikmə yoxdur, ona görə nişan
 * almaq hissi itmir. Halqa isə arxadan yumşaq gəlir (lerp) və hərəkət
 * dayananda nöqtənin ətrafında oturur; bütün canlılıq bu iki fərqli
 * sürətdən doğur.
 *
 * Link/düymə üstündə halqa genişlənir və nöqtə kiçilir — klik edilə bilən
 * sahə kursorun özündən oxunur.
 */

/** Halqanın kursora çatma sürəti — kiçik dəyər daha çox "gecikmə" deməkdir. */
const RING_EASE = 0.16
/** Ölçü dəyişikliyinin yumşaqlığı (hover-də böyümə/kiçilmə). */
const SCALE_EASE = 0.14

export function LiquidCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ring = ringRef.current
    const dot = dotRef.current
    if (!ring || !dot) return

    const fine = window.matchMedia('(pointer: fine)').matches
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || still) return

    // Toxunma cihazında sistem kursoru lazımdır; yalnız siçanlı cihazda gizlədirik.
    document.documentElement.classList.add('has-custom-cursor')

    let targetX = 0
    let targetY = 0
    let ringX = 0
    let ringY = 0
    let ringScale = 1
    let dotScale = 1
    let hot = false
    let pressed = false
    let seeded = false
    let frame = 0

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX
      targetY = e.clientY

      if (!seeded) {
        seeded = true
        ringX = targetX
        ringY = targetY
        ring.style.opacity = '1'
        dot.style.opacity = '1'
      }

      const el = e.target as Element | null
      hot = Boolean(el?.closest?.('a, button, [role="button"], input, textarea, select, label'))
    }

    const onLeave = () => {
      ring.style.opacity = '0'
      dot.style.opacity = '0'
      seeded = false
    }
    const onDown = () => (pressed = true)
    const onUp = () => (pressed = false)

    const tick = () => {
      ringX += (targetX - ringX) * RING_EASE
      ringY += (targetY - ringY) * RING_EASE

      // Basılanda halqa bir az sıxılır — toxunuşa cavab hissi verir.
      const wantRing = hot ? 1.9 : pressed ? 0.82 : 1
      const wantDot = hot ? 0.45 : pressed ? 1.3 : 1
      ringScale += (wantRing - ringScale) * SCALE_EASE
      dotScale += (wantDot - dotScale) * SCALE_EASE

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale.toFixed(3)})`
      // Nöqtə birbaşa hədəfdədir — kursorla eyni anda gedir.
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%) scale(${dotScale.toFixed(3)})`

      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    frame = requestAnimationFrame(tick)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {/* Halqa — arxadan gələn, hover-də genişlənən çərçivə */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 h-9 w-9 rounded-full border border-foreground/70 opacity-0 transition-opacity duration-300"
        style={{ willChange: 'transform' }}
      />
      {/* Nöqtə — kursorun dəqiq yeri */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 h-[5px] w-[5px] rounded-full bg-foreground opacity-0 transition-opacity duration-300"
        style={{ willChange: 'transform' }}
      />
    </div>
  )
}

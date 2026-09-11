import { useEffect, useRef, useState } from 'react'
import { hero } from '@/content/landing'

/**
 * Portalın tam açıq radiusu (px). Şəkil ~530px enindədir — bundan böyük
 * radius bütün portreti çevirir və "linza" hissi itir.
 */
const MAX_RADIUS = 125
/** Mərkəzin kursoru izləmə sürəti — kiçik rəqəm = daha gec, daha "axıcı". */
const CENTER_EASE = 0.18
/** Radiusun açılıb-bağlanma sürəti. */
const RADIUS_EASE = 0.12
/** Bu məsafədən uzaqda portal bağlanır (şəklin kənarından, px). */
const HOVER_PADDING = 140

/**
 * Hero portreti — iki qat.
 *
 * Üstdə piksel-art, arxasında eyni pozanın real fotosu. Kursor
 * gəzdikcə üstdəki fotoda radial "deşik" açılır və arxadakı görünür.
 *
 * Mərkəz və radius hər kadr kursora doğru interpolyasiya olunur (lerp), ona
 * görə portal kursorun arxasınca yumşaq sürüşür, dartılmır.
 *
 * Vacib: dəyərlər CSS dəyişənlərinə yazılır, state-ə YOX — əks halda hər
 * mouse hərəkəti React render-i tətikləyərdi.
 */
export function PortraitPortal() {
  const boxRef = useRef<HTMLDivElement>(null)

  // Toxunma cihazında kursor yoxdur, hərəkət azaldılmış rejimdə isə
  // istənmir — hər iki halda maska heç tətbiq olunmur (aşağıda), ön foto
  // sadə, maskasız göstərilir. Mobil brauzerlərin bəzilərində sıfıra yaxın
  // radiuslu radial-gradient maskası gözlənilməz render olunur (arxadakı
  // real foto görünür) — ən etibarlı həll maskanı belə hallarda heç
  // yaratmamaqdır.
  const [interactive] = useState(
    () =>
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const box = boxRef.current
    if (!box || !interactive) return

    // Hədəf dəyərlər (kursor) və cari dəyərlər (ekranda görünən).
    let targetX = 0
    let targetY = 0
    let targetR = 0
    let curX = 0
    let curY = 0
    let curR = 0
    let seeded = false
    let frame = 0

    // Şəkil artıq kursoru izləmir (Magnet yoxdur), ona görə qutunun yeri
    // yalnız scroll və resize zamanı dəyişir — hər mouse hərəkətində
    // getBoundingClientRect çağırmaq layout yenidən hesablatdırardı.
    let rect = box.getBoundingClientRect()
    const measure = () => {
      rect = box.getBoundingClientRect()
    }

    const onMove = (e: PointerEvent) => {
      if (rect.width === 0) return

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const near =
        x > -HOVER_PADDING &&
        x < rect.width + HOVER_PADDING &&
        y > -HOVER_PADDING &&
        y < rect.height + HOVER_PADDING

      targetX = x
      targetY = y
      targetR = near ? MAX_RADIUS : 0

      // İlk dəfə mərkəzi tullanmadan yerinə qoy.
      if (!seeded) {
        seeded = true
        curX = x
        curY = y
      }
    }

    const tick = () => {
      curX += (targetX - curX) * CENTER_EASE
      curY += (targetY - curY) * CENTER_EASE
      curR += (targetR - curR) * RADIUS_EASE

      box.style.setProperty('--px', `${curX.toFixed(1)}px`)
      box.style.setProperty('--py', `${curY.toFixed(1)}px`)
      box.style.setProperty('--pr', `${curR.toFixed(1)}px`)

      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    frame = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      cancelAnimationFrame(frame)
    }
  }, [interactive])

  // Radiusun 46%-inə qədər tam şəffaf, sonra kənara doğru uzun keçid —
  // deşiyin kənarı kəskin dairə deyil, işıq ləkəsi kimi əriyir.
  //
  // Yalnız `interactive` olanda (siçanlı cihaz) tətbiq olunur. Toxunma
  // cihazlarında bu tamam çıxarılır — bəzi mobil brauzerlər sıfıra yaxın
  // radiuslu radial-gradient-i gözlənilməz render edir (ön şəkil əvəzinə
  // arxadakı real foto görünür); ən etibarlı həll heç maska yaratmamaqdır.
  const portalMask = interactive
    ? 'radial-gradient(circle var(--pr, 0px) at var(--px, 50%) var(--py, 50%),' +
      ' transparent 0%, transparent 46%, #fff 100%)'
    : undefined

  return (
    <div
      ref={boxRef}
      className="relative"
      style={{ '--px': '50%', '--py': '50%', '--pr': '0px' } as React.CSSProperties}
    >
      {/* Arxa qat — real foto. Ön qat onu tam örtür, yalnız portalda görünür. */}
      <img
        src={hero.imageBack}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
      />

      {/* Ön qat — piksel-art. Qutunun ölçüsünü bu verir. */}
      <img
        src={hero.imageFront}
        alt={hero.imageAlt}
        fetchPriority="high"
        className="pointer-events-none relative h-auto w-full select-none object-contain"
        style={{ maskImage: portalMask, WebkitMaskImage: portalMask }}
      />
    </div>
  )
}

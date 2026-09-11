import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ScrollMarqueeRowProps {
  items: readonly string[]
  /** 1 = sağa, -1 = sola sürüşür. */
  direction: 1 | -1
  offset: number
  className?: string
  separator?: ReactNode
}

/**
 * Bir marquee sətri. Siyahı üç dəfə təkrarlanır və bir tam dəst sola çəkilir ki,
 * hansı istiqamətə sürüşməsindən asılı olmayaraq kənarda boşluq görünməsin.
 */
function Row({ items, direction, offset, className, separator }: ScrollMarqueeRowProps) {
  const tripled = [...items, ...items, ...items]

  return (
    <div className="flex w-max items-center" style={{ transform: 'translateX(-33.333%)' }}>
      <div
        className="flex w-max items-center gap-8 sm:gap-12"
        style={{ transform: `translateX(${direction * offset}px)`, willChange: 'transform' }}
      >
        {tripled.map((item, i) => (
          <span key={`${item}-${i}`} className={cn('flex shrink-0 items-center gap-8 sm:gap-12', className)}>
            {item}
            {separator}
          </span>
        ))}
      </div>
    </div>
  )
}

export interface ScrollMarqueeProps {
  rowOne: readonly string[]
  rowTwo: readonly string[]
  className?: string
  rowClassName?: string
  separator?: ReactNode
}

/**
 * Səhifə sürüşdükcə iki sətir əks istiqamətlərdə hərəkət edir.
 * Ofset bölmənin ekrandakı mövqeyindən hesablanır — avtomatik döngü deyil,
 * tamamilə istifadəçinin scroll-una bağlıdır.
 */
export function ScrollMarquee({
  rowOne,
  rowTwo,
  className,
  rowClassName,
  separator,
}: ScrollMarqueeProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const update = () => {
      frame = 0
      const node = sectionRef.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      // Bölmə ekranın altından girəndə 0-a yaxın, yuxarı çıxdıqca artır.
      setOffset((window.innerHeight - rect.top) * 0.28)
    }
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const shift = offset - 240

  return (
    <div ref={sectionRef} className={cn('flex flex-col gap-3 sm:gap-5', className)}>
      <Row items={rowOne} direction={1} offset={shift} className={rowClassName} separator={separator} />
      <Row items={rowTwo} direction={-1} offset={shift} className={rowClassName} separator={separator} />
    </div>
  )
}

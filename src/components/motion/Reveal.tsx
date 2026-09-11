import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const OFFSET: Record<Direction, string> = {
  up: 'translate3d(0, 28px, 0)',
  down: 'translate3d(0, -28px, 0)',
  left: 'translate3d(28px, 0, 0)',
  right: 'translate3d(-28px, 0, 0)',
  none: 'none',
}

export interface RevealProps {
  children: ReactNode
  /** Gecikmə (ms) — qonşu elementləri pilləli açmaq üçün. */
  delay?: number
  direction?: Direction
  className?: string
  as?: 'div' | 'section' | 'li' | 'article' | 'header'
}

/**
 * Scroll etdikcə içindəkini açan sarğı.
 * IntersectionObserver bir dəfə işə düşür — geri sürüşdürəndə element yenidən gizlənmir,
 * çünki təkrarlanan animasiya uzun səhifədə yorucu olur.
 */
export function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Hərəkəti azaldılmış rejimdə dərhal göstər, animasiya etmə.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as never}
      className={cn(className)}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : OFFSET[direction],
        filter: shown ? 'blur(0px)' : 'blur(6px)',
        transition: `opacity 700ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms,
                     transform 700ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms,
                     filter 700ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: shown ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  )
}

import { useRef, type CSSProperties } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CharProps {
  char: string
  range: [number, number]
  progress: MotionValue<number>
}

function Char({ char, range, progress }: CharProps) {
  const opacity = useTransform(progress, range, [0.18, 1])

  return (
    <span className="relative inline-block">
      {/* Görünməyən nüsxə eni tutur, üstündəki mütləq yerləşdirilmiş nüsxə canlanır. */}
      <span className="opacity-0">{char}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity }} aria-hidden>
        {char}
      </motion.span>
    </span>
  )
}

export interface ScrollRevealTextProps {
  text: string
  className?: string
  style?: CSSProperties
}

/**
 * Scroll ilə hərf-hərf açılan mətn.
 * Hər hərf öz növbəsində 0.18 → 1 şəffaflığa keçir.
 * Boşluqlar adi mətn qalır ki, abzas normal sətirlərə bölünsün.
 */
export function ScrollRevealText({ text, className, style }: ScrollRevealTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.35'],
  })

  const chars = Array.from(text)

  return (
    <p ref={ref} className={cn(className)} style={style} aria-label={text}>
      {chars.map((char, i) => {
        if (char === ' ') return <span key={i}> </span>
        return (
          <Char
            key={i}
            char={char}
            range={[i / chars.length, (i + 1) / chars.length]}
            progress={scrollYProgress}
          />
        )
      })}
    </p>
  )
}

import { ScrollMarquee } from '@/components/motion/ScrollMarquee'
import { marqueeRowOne, marqueeRowTwo } from '@/content/landing'

/**
 * Hero ilə "Haqqımda" arasında sürüşən söz lenti.
 * Şəkil yerinə söz işlədilir — real iş şəkilləri olmadığı üçün
 * saxta thumbnail göstərmək əvəzinə fəaliyyət sahələri yazılır.
 */
export function DisciplineBand() {
  return (
    <section aria-hidden className="select-none py-16 sm:py-24 md:py-32">
      <ScrollMarquee
        rowOne={marqueeRowOne}
        rowTwo={marqueeRowTwo}
        rowClassName="font-display font-extrabold uppercase tracking-tight text-[13vw] leading-none sm:text-[9vw] md:text-[7vw] text-foreground/10"
        separator={
          <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-primary/40 sm:h-3 sm:w-3" />
        }
      />
    </section>
  )
}

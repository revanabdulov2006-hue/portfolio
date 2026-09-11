import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/button'
import { closing } from '@/content/landing'

export function Closing() {
  return (
    <section className="border-t border-border px-5 py-24 text-center sm:px-8 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2
            className="display-gradient font-display font-extrabold uppercase leading-[0.95] tracking-tighter"
            style={{ fontSize: 'clamp(2.2rem, 7vw, 5rem)' }}
          >
            {closing.title}
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {closing.body}
          </p>
        </Reveal>

        <Reveal delay={180}>
          <Link to="/telimler" className="mt-10 inline-block">
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

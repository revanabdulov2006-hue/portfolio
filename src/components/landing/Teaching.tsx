import { Reveal } from '@/components/motion/Reveal'
import { disciplines } from '@/content/landing'

/**
 * "Nə öyrədirəm" — ağ bölmə, nömrələnmiş siyahı.
 * Tünd landing-in ortasında ağ blok qəsdən qoyulub: kontrast səhifəni bölür
 * və sənəddəki ağ/mavi palitranı geri gətirir.
 *
 * Diqqət: burada kurs kartı, qiymət və ya kurs siyahısı YOXDUR — brifin
 * "ana səhifədə kurs görünməsin" qaydası pozulmur. Bunlar fəaliyyət sahələridir.
 */
export function Teaching() {
  return (
    <section
      id="ne-oyredirem"
      className="relative z-0 rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:py-32"
    >
      <Reveal>
        <h2
          className="display-gradient-ink text-center font-display font-extrabold uppercase leading-none tracking-tighter"
          style={{ fontSize: 'clamp(2.6rem, 11vw, 150px)' }}
        >
          Nə öyrədirəm
        </h2>
      </Reveal>

      <div className="mx-auto mt-16 max-w-5xl sm:mt-20 md:mt-28">
        {disciplines.map((d, i) => (
          <Reveal key={d.id} delay={i * 100}>
            <article
              className="flex items-start gap-5 py-8 sm:gap-8 sm:py-10 md:gap-12 md:py-12"
              style={{
                borderTop: i === 0 ? '1px solid hsl(218 42% 12% / 0.15)' : undefined,
                borderBottom: '1px solid hsl(218 42% 12% / 0.15)',
              }}
            >
              <span
                className="shrink-0 font-display font-extrabold leading-none tabular-nums text-[#121b2c]"
                style={{ fontSize: 'clamp(2.6rem, 9vw, 130px)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="flex flex-col gap-3 pt-1 sm:gap-4">
                <h3
                  className="font-display font-semibold uppercase leading-tight tracking-tight text-[#121b2c]"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2rem)' }}
                >
                  {d.title}
                </h3>
                <p
                  className="max-w-2xl font-light leading-relaxed text-[#121b2c]/60"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.2rem)' }}
                >
                  {d.description}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

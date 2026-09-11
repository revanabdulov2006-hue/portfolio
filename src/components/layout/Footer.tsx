import { Link } from 'react-router-dom'
import { siteConfig } from '@/config/site'

export function Footer() {
  const year = new Date().getFullYear()

  const socials = [
    { label: 'Instagram', href: siteConfig.social.instagram },
    { label: 'Facebook', href: siteConfig.social.facebook },
    { label: 'LinkedIn', href: siteConfig.social.linkedin },
  ].filter((s) => s.href)

  return (
    <footer className="border-t border-border bg-cream/60">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-3.5">
              <img
                src="/images/logo.png"
                alt=""
                aria-hidden
                className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-foreground/15 sm:h-14 sm:w-14"
              />
              <span className="font-display text-2xl font-extrabold uppercase leading-none tracking-tighter sm:text-3xl">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Marketinq, AI alətləri, satış və dropshipping üzrə təlimlər.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <nav aria-label="Sayt">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Sayt
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link to="/" className="text-foreground/80 transition-colors hover:text-primary">
                    Ana səhifə
                  </Link>
                </li>
                <li>
                  <Link
                    to="/telimler"
                    className="text-foreground/80 transition-colors hover:text-primary"
                  >
                    Təlimlər
                  </Link>
                </li>
                <li>
                  <Link
                    to="/telimlerim"
                    className="text-foreground/80 transition-colors hover:text-primary"
                  >
                    Mənim təlimlərim
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-label="Əlaqə">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Əlaqə
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a
                    href={`mailto:${siteConfig.contactEmail}`}
                    className="text-foreground/80 transition-colors hover:text-primary"
                  >
                    Email
                  </a>
                </li>
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-foreground/80 transition-colors hover:text-primary"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}
          </p>
          <Link to="/mexfilik-siyaseti" className="transition-colors hover:text-primary">
            Məxfilik siyasəti
          </Link>
        </div>
      </div>
    </footer>
  )
}

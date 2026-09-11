import { useLayoutEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { isSupabaseConfigured } from '@/lib/supabase'
import { Notice } from '@/components/ui/field'

/** Giriş / qeydiyyat / şifrə bərpası səhifələrinin ortaq çərçivəsi. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}) {
  /*
   * Auth səhifələri SiteLayout-dan kənarda render olunur, ona görə tünd temanı
   * özləri qoyur — ictimai səhifələrlə eyni görünsün deyə.
   */
  useLayoutEffect(() => {
    document.body.classList.add('dark')
    return () => document.body.classList.remove('dark')
  }, [])

  return (
    <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-background px-5 py-28 text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 45% at 50% 0%, hsl(var(--accent)) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="rounded-[32px] border-2 border-border bg-card p-7 shadow-[0_30px_80px_-40px_hsl(var(--primary)/0.35)] sm:rounded-[40px] sm:p-9">
          <Link to="/" className="mb-8 inline-flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt=""
              aria-hidden
              className="h-9 w-9 rounded-full object-cover ring-1 ring-foreground/15"
            />
            <span className="font-display text-sm font-bold uppercase tracking-tight">
              Rəvan Abdulzadə
            </span>
          </Link>

          <h1 className="display-gradient font-display text-2xl font-extrabold uppercase leading-tight tracking-tighter sm:text-3xl">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}

          {!isSupabaseConfigured && (
            <div className="mt-6">
              <Notice tone="error">
                Supabase hələ qoşulmayıb. <code>.env.example</code> faylını <code>.env</code>{' '}
                adı ilə kopyalayıb layihə açarlarını doldurun.
              </Notice>
            </div>
          )}

          <div className="mt-7">{children}</div>
        </div>

        {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import {
  KineticMenu,
  KineticMenuButton,
} from '@/components/ui/sterling-gate-kinetic-navigation'

const PUBLIC_LINKS = [
  { to: '/', label: 'Ana səhifə', end: true },
  { to: '/telimler', label: 'Təlimlər', end: false },
]

/** "Mənim təlimlərim" yalnız daxil olmuş istifadəçiyə görünür. */
const MEMBER_LINK = { to: '/telimlerim', label: 'Mənim təlimlərim', end: false }

/**
 * Tam ekran menyuda ana səhifənin bölmələri də olur — masaüstü sətrində
 * onlara yer yoxdur, amma menyuda yer boldur.
 * Hash keçidini SiteLayout-dakı ScrollToTop idarə edir.
 */
function MENU_LINKS(base: { to: string; label: string; end?: boolean }[]) {
  const [home, ...rest] = base
  return [
    home,
    { to: '/#haqqimda', label: 'Haqqımda' },
    { to: '/#isler', label: 'İşlərim' },
    ...rest,
  ]
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { session, signOut } = useAuth()
  const navigate = useNavigate()

  async function onSignOut() {
    setOpen(false)
    await signOut()
    navigate('/', { replace: true })
  }

  const links = session ? [...PUBLIC_LINKS, MEMBER_LINK] : PUBLIC_LINKS

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Menyu açıqkən arxa fonun sürüşməsini dayandır.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        /*
          Menyu açıqkən header MÜTLƏQ şəffaf olmalıdır. İki səbəb:
          1) `backdrop-blur-xl` header-i `position: fixed` nəsilləri üçün
             containing block-a çevirir — menyu bunun ucbatından 64px-lik
             zolağa sıxılırdı (indi portal ilə çıxarılıb, amma qayıtmasın).
          2) Menyu header-in altındadır (z-45 < z-50); header-in öz fonu
             qalsa, panelin yuxarı zolağı onun arxasında kəsilmiş görünərdi.
        */
        scrolled && !open
          ? 'border-b border-border/70 bg-background/80 backdrop-blur-xl'
          : 'border-b border-transparent',
      )}
    >
      {/*
        Jack-3d üslubu: konteyner yoxdur, elementlər ekranın iki kənarına
        `justify-between` ilə yayılır; fon şəffafdır, yalnız böyük hərfli
        mətn linkləri və hover-də opasite azalması var.
      */}
      {/* `relative z-50` — kinetik menyu (z-45) açılanda logo və bağlama
          düyməsi onun altında qalmasın. */}
      <nav className="relative z-50 flex h-16 items-center justify-between px-6 md:h-20 md:px-10">
        <Link
          to="/"
          className="flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-70"
          onClick={() => setOpen(false)}
        >
          <img
            src="/images/logo.png"
            alt=""
            aria-hidden
            className="h-9 w-9 rounded-full object-cover ring-1 ring-foreground/15 md:h-10 md:w-10"
          />
          {/* Ad silinib — link mətnsiz qalmasın deyə ekran oxuyucusu üçün ad. */}
          <span className="sr-only">Ana səhifə</span>
        </Link>

        {/* Masaüstü — linklər sağ kənara qədər bərabər yayılır */}
        <div className="hidden items-center gap-8 md:flex lg:gap-14">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  'font-medium uppercase tracking-wider transition-opacity duration-200 md:text-lg lg:text-[1.4rem]',
                  isActive ? 'text-foreground' : 'text-foreground/70',
                  'hover:opacity-70',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          {session ? (
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 font-medium uppercase tracking-wider text-foreground/70 transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
            >
              <LogOut className="h-4 w-4 lg:h-5 lg:w-5" />
              Çıxış
            </button>
          ) : (
            <Link
              to="/giris"
              className="font-medium uppercase tracking-wider transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
            >
              Giriş
            </Link>
          )}
        </div>

        <KineticMenuButton open={open} onClick={() => setOpen((v) => !v)} />
      </nav>

      {/*
        Mobil naviqasiya — tam ekran kinetik menyu. Masaüstü sətri
        yuxarıda olduğu kimi qalır; bu overlay yalnız `md`-dən aşağıda görünür.
      */}
      <KineticMenu
        open={open}
        onClose={() => setOpen(false)}
        links={MENU_LINKS(links)}
        action={
          session ? { label: 'Çıxış', onClick: onSignOut } : { label: 'Giriş', to: '/giris' }
        }
      />
    </header>
  )
}

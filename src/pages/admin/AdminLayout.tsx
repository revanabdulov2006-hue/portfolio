import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BookOpen, Inbox, LayoutDashboard, LogOut, Users } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/admin', end: true, label: 'Ümumi baxış', icon: LayoutDashboard },
  { to: '/admin/istifadeciler', end: false, label: 'İstifadəçilər', icon: Users },
  { to: '/admin/sorgular', end: false, label: 'Sorğular', icon: Inbox },
  { to: '/admin/kurslar', end: false, label: 'Kurslar', icon: BookOpen },
]

/**
 * Admin paneli ictimai saytın Navbar/Footer-indən tam ayrıdır —
 * adi istifadəçi interfeysindən bura heç bir keçid linki yoxdur.
 */
export function AdminLayout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  async function onSignOut() {
    await signOut()
    navigate('/admin/giris', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-secondary/40">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-background md:flex md:flex-col">
        <div className="border-b border-border px-6 py-5">
          <p className="font-display text-sm font-bold tracking-tight">Admin panel</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{profile?.email}</p>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )
              }
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3">
          <button
            type="button"
            onClick={onSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Çıxış
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Mobil naviqasiya */}
        <div className="flex gap-1 overflow-x-auto border-b border-border bg-background px-3 py-2 md:hidden">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap rounded-lg px-3 py-2 text-sm',
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </div>

        <main className="p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

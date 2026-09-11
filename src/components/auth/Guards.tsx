import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components/ui/field'

function FullPageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner className="h-6 w-6 text-primary" />
    </div>
  )
}

/** Daxil olmayan istifadəçini girişə göndərir və hara getmək istədiyini yadda saxlayır. */
export function RequireAuth() {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) return <FullPageLoader />
  if (!session) return <Navigate to="/giris" state={{ from: location.pathname }} replace />
  return <Outlet />
}

/**
 * Admin qoruyucusu. Diqqət: bu yalnız interfeys səviyyəsindədir —
 * əsl qoruma Supabase RLS-dədir (bax: supabase/schema.sql).
 */
export function RequireAdmin() {
  const { session, profile, loading } = useAuth()

  if (loading) return <FullPageLoader />
  if (!session) return <Navigate to="/admin/giris" replace />
  // Profil hələ yüklənməyibsə gözlə, dərhal ata atma.
  if (!profile) return <FullPageLoader />
  if (profile.role !== 'admin') return <Navigate to="/" replace />
  return <Outlet />
}

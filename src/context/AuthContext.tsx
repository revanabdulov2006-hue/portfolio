import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import type { Profile } from '@/types/db'

type AuthValue = {
  session: Session | null
  user: User | null
  profile: Profile | null
  isAdmin: boolean
  /** İlk sessiya yoxlanışı bitənə qədər true. Marşrut qoruyucuları bunu gözləyir. */
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.error('Profil oxunmadı:', error.message)
      setProfile(null)
      return
    }
    setProfile(data as Profile | null)
  }, [])

  useEffect(() => {
    // Supabase qurulmayıbsa şəbəkə sorğusu göndərmə — landing page açıq qalsın.
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    let active = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      setSession(data.session)
      if (data.session?.user) await loadProfile(data.session.user.id)
      if (active) setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
      if (next?.user) {
        // onAuthStateChange içində birbaşa await etmək Supabase-də kilidlənməyə
        // səbəb ola bilir — ona görə növbəti tick-ə atırıq.
        setTimeout(() => {
          void loadProfile(next.user.id)
        }, 0)
      } else {
        setProfile(null)
      }
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [loadProfile])

  // Son aktivlik tarixini yenilə (admin panelin "son aktivlik" sütunu üçün).
  useEffect(() => {
    if (!session?.user) return
    void supabase
      .from('profiles')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('id', session.user.id)
  }, [session?.user?.id])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }, [])

  const refreshProfile = useCallback(async () => {
    if (session?.user) await loadProfile(session.user.id)
  }, [session?.user, loadProfile])

  const value = useMemo<AuthValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      isAdmin: profile?.role === 'admin',
      loading,
      signOut,
      refreshProfile,
    }),
    [session, profile, loading, signOut, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth yalnız <AuthProvider> daxilində işləyir')
  return ctx
}

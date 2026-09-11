import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * .env faylı hazırlanmayıbsa sayt tamamilə sınmamalıdır —
 * landing page (Supabase-siz işləyən hissə) yenə açılsın,
 * yalnız hesab/kurs bölmələri xəbərdarlıq göstərsin.
 */
export const isSupabaseConfigured = Boolean(url && anonKey)

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY təyin edilməyib. ' +
      '.env.example faylını .env adı ilə kopyalayıb dəyərləri doldur.',
  )
}

export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: isSupabaseConfigured,
      autoRefreshToken: isSupabaseConfigured,
      detectSessionInUrl: isSupabaseConfigured,
    },
  },
)

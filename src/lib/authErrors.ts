/**
 * Supabase ingiliscə xəta mətnlərini azərbaycancaya çevirir.
 * Tanımadığı xəta üçün ümumi mesaj qaytarır — istifadəçiyə xam ingilis mətn göstərilmir.
 */
export function authErrorMessage(raw: string | undefined | null): string {
  if (!raw) return 'Gözlənilməz xəta baş verdi. Bir az sonra yenidən yoxlayın.'

  const m = raw.toLowerCase()

  if (m.includes('invalid login credentials')) return 'Email və ya şifrə yanlışdır.'
  if (m.includes('email not confirmed')) return 'Email ünvanınız hələ təsdiqlənməyib. Poçtunuzu yoxlayın.'
  if (m.includes('user already registered') || m.includes('already been registered'))
    return 'Bu email ilə artıq hesab var. Giriş etməyi sınayın.'
  if (m.includes('password should be at least'))
    return 'Şifrə ən azı 8 simvol olmalıdır.'
  if (m.includes('token has expired') || m.includes('otp_expired'))
    return 'Kodun vaxtı bitib. Yeni kod tələb edin.'
  if (m.includes('invalid token') || m.includes('token not found'))
    return 'Kod yanlışdır. Yenidən yoxlayın.'
  if (m.includes('rate limit') || m.includes('too many requests'))
    return 'Çox sayda cəhd edildi. Bir neçə dəqiqə gözləyin.'
  if (m.includes('unable to validate email') || m.includes('invalid email'))
    return 'Email ünvanı düzgün deyil.'
  if (m.includes('failed to fetch') || m.includes('network'))
    return 'İnternet bağlantısı ilə problem var.'

  return 'Gözlənilməz xəta baş verdi. Bir az sonra yenidən yoxlayın.'
}

/** Frontend doğrulaması. Backend doğrulaması Supabase + RLS tərəfindədir. */
export const validate = {
  email(v: string): string | null {
    if (!v.trim()) return 'Email daxil edin.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Email ünvanı düzgün deyil.'
    return null
  },
  password(v: string): string | null {
    if (!v) return 'Şifrə daxil edin.'
    if (v.length < 8) return 'Şifrə ən azı 8 simvol olmalıdır.'
    return null
  },
  required(v: string, label: string): string | null {
    if (!v.trim()) return `${label} daxil edin.`
    if (v.trim().length < 2) return `${label} ən azı 2 simvol olmalıdır.`
    return null
  },
}

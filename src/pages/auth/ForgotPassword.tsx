import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { authErrorMessage, validate } from '@/lib/authErrors'
import { AuthShell } from './AuthShell'
import { Button } from '@/components/ui/button'
import { FieldError, Input, Label, Notice, Spinner } from '@/components/ui/field'

/**
 * Üç addımlı şifrə bərpası:
 *   1) email  → Supabase emailə 6 rəqəmli kod göndərir
 *   2) kod    → verifyOtp ilə emailin istifadəçiyə aid olduğu təsdiqlənir
 *   3) şifrə  → updateUser ilə yeni şifrə təyin edilir
 *
 * VACIB: 2-ci addımın işləməsi üçün Supabase Dashboard-da
 * Authentication → Emails → "Reset Password" şablonunda {{ .Token }} olmalıdır.
 * Standart şablon yalnız link ({{ .ConfirmationURL }}) göndərir — kod gəlmir.
 * Bax: supabase/README.md
 */
type Step = 'email' | 'code' | 'password'

export default function ForgotPassword() {
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  const [fieldError, setFieldError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function sendCode(e?: FormEvent) {
    e?.preventDefault()
    setFormError(null)
    setInfo(null)

    const err = validate.email(email)
    setFieldError(err)
    if (err) return

    setBusy(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim())
    setBusy(false)

    // Hesabın mövcud olub-olmadığını AÇIQLAMIRIQ — əks halda bu səhifə
    // email yoxlama alətinə çevrilir. Xəta olsa da eyni mesajı göstəririk.
    if (error && /rate limit|too many/i.test(error.message)) {
      setFormError(authErrorMessage(error.message))
      return
    }
    setStep('code')
    setInfo('Kod göndərildi. Poçtunu yoxla (spam qovluğuna da bax).')
  }

  async function verifyCode(e: FormEvent) {
    e.preventDefault()
    setFormError(null)

    const clean = code.replace(/\D/g, '')
    if (clean.length !== 6) {
      setFieldError('Kod 6 rəqəmdən ibarətdir.')
      return
    }
    setFieldError(null)

    setBusy(true)
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: clean,
      type: 'recovery',
    })
    setBusy(false)

    if (error) {
      setFormError(authErrorMessage(error.message))
      return
    }
    setInfo(null)
    setStep('password')
  }

  async function setNewPassword(e: FormEvent) {
    e.preventDefault()
    setFormError(null)

    const err = validate.password(password)
    if (err) {
      setFieldError(err)
      return
    }
    if (password !== password2) {
      setFieldError('Şifrələr eyni deyil.')
      return
    }
    setFieldError(null)

    setBusy(true)
    const { error } = await supabase.auth.updateUser({ password })
    setBusy(false)

    if (error) {
      setFormError(authErrorMessage(error.message))
      return
    }
    navigate('/telimlerim', { replace: true })
  }

  if (step === 'code') {
    return (
      <AuthShell title="Kodu daxil et" subtitle={`${email.trim()} ünvanına 6 rəqəmli kod göndərdik.`}>
        <form onSubmit={verifyCode} noValidate className="space-y-5">
          {formError && <Notice tone="error">{formError}</Notice>}
          {info && <Notice tone="success">{info}</Notice>}

          <div>
            <Label htmlFor="code">Təsdiq kodu</Label>
            <Input
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="000000"
              className="text-center font-display text-2xl tracking-[0.4em]"
              value={code}
              aria-invalid={!!fieldError}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
            <FieldError>{fieldError}</FieldError>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? <Spinner /> : null}
            {busy ? 'Yoxlanılır…' : 'Kodu təsdiqlə'}
          </Button>

          <button
            type="button"
            onClick={() => void sendCode()}
            disabled={busy}
            className="w-full text-center text-sm text-muted-foreground transition-colors hover:text-primary disabled:opacity-50"
          >
            Kod gəlmədi? Yenidən göndər
          </button>
        </form>
      </AuthShell>
    )
  }

  if (step === 'password') {
    return (
      <AuthShell title="Yeni şifrə" subtitle="Email təsdiqləndi. İndi yeni şifrəni təyin et.">
        <form onSubmit={setNewPassword} noValidate className="space-y-5">
          {formError && <Notice tone="error">{formError}</Notice>}

          <div>
            <Label htmlFor="np">Yeni şifrə</Label>
            <Input
              id="np"
              type="password"
              autoComplete="new-password"
              placeholder="Ən azı 8 simvol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="np2">Yeni şifrə (təkrar)</Label>
            <Input
              id="np2"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password2}
              aria-invalid={!!fieldError}
              onChange={(e) => setPassword2(e.target.value)}
            />
            <FieldError>{fieldError}</FieldError>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? <Spinner /> : null}
            {busy ? 'Yadda saxlanılır…' : 'Şifrəni dəyiş'}
          </Button>
        </form>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Şifrəni unutdun?"
      subtitle="Email ünvanını yaz — sənə təsdiq kodu göndərək."
      footer={
        <Link to="/giris" className="font-medium text-primary hover:underline">
          Girişə qayıt
        </Link>
      }
    >
      <form onSubmit={sendCode} noValidate className="space-y-5">
        {formError && <Notice tone="error">{formError}</Notice>}

        <div>
          <Label htmlFor="fe">Email</Label>
          <Input
            id="fe"
            type="email"
            autoComplete="email"
            placeholder="ad@example.com"
            value={email}
            aria-invalid={!!fieldError}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FieldError>{fieldError}</FieldError>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? <Spinner /> : null}
          {busy ? 'Göndərilir…' : 'Kod göndər'}
        </Button>
      </form>
    </AuthShell>
  )
}

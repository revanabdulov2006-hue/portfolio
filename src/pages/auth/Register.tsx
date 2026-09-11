import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { authErrorMessage, validate } from '@/lib/authErrors'
import { AuthShell } from './AuthShell'
import { Button } from '@/components/ui/button'
import { FieldError, Input, Label, Notice, Spinner } from '@/components/ui/field'

type Errors = Partial<Record<'firstName' | 'lastName' | 'email' | 'password', string | null>>

export default function Register() {
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [needsConfirm, setNeedsConfirm] = useState(false)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)

    const next: Errors = {
      firstName: validate.required(firstName, 'Adınızı'),
      lastName: validate.required(lastName, 'Soyadınızı'),
      email: validate.email(email),
      password: validate.password(password),
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    const fullName = `${firstName.trim()} ${lastName.trim()}`

    setBusy(true)
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: fullName } },
    })
    setBusy(false)

    if (error) {
      setFormError(authErrorMessage(error.message))
      return
    }

    // Supabase-də email təsdiqi açıqdırsa sessiya gəlmir — istifadəçiyə poçtu yoxlamağı deyirik.
    if (!data.session) {
      setNeedsConfirm(true)
      return
    }
    navigate('/telimlerim', { replace: true })
  }

  if (needsConfirm) {
    return (
      <AuthShell
        title="Emailini təsdiqlə"
        subtitle={`${email.trim()} ünvanına təsdiq linki göndərdik.`}
      >
        <Notice tone="success">
          Poçtunu aç və linkə klikləyərək hesabını aktivləşdir. Məktub gəlməyibsə, spam
          qovluğunu da yoxla.
        </Notice>
        <Link to="/giris" className="mt-6 block">
          <Button variant="outline" size="lg" className="w-full">
            Giriş səhifəsinə keç
          </Button>
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Hesab yarat"
      subtitle="Pulsuz təlimlərə dərhal başlaya bilərsən."
      footer={
        <>
          Artıq hesabın var?{' '}
          <Link to="/giris" className="font-medium text-primary hover:underline">
            Daxil ol
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {formError && <Notice tone="error">{formError}</Notice>}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="firstName">Ad</Label>
            <Input
              id="firstName"
              autoComplete="given-name"
              placeholder="Rəvan"
              value={firstName}
              aria-invalid={!!errors.firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <FieldError>{errors.firstName}</FieldError>
          </div>
          <div>
            <Label htmlFor="lastName">Soyad</Label>
            <Input
              id="lastName"
              autoComplete="family-name"
              placeholder="Abdulzadə"
              value={lastName}
              aria-invalid={!!errors.lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <FieldError>{errors.lastName}</FieldError>
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="ad@example.com"
            value={email}
            aria-invalid={!!errors.email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FieldError>{errors.email}</FieldError>
        </div>

        <div>
          <Label htmlFor="password">Şifrə</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Ən azı 8 simvol"
            value={password}
            aria-invalid={!!errors.password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FieldError>{errors.password}</FieldError>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? <Spinner /> : null}
          {busy ? 'Yaradılır…' : 'Hesab yarat'}
        </Button>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Qeydiyyatdan keçməklə{' '}
          <Link to="/mexfilik-siyaseti" className="underline underline-offset-2">
            məxfilik siyasəti
          </Link>{' '}
          ilə razılaşmış olursan.
        </p>
      </form>
    </AuthShell>
  )
}

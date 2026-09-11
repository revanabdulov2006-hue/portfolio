import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { authErrorMessage, validate } from '@/lib/authErrors'
import { AuthShell } from './AuthShell'
import { Button } from '@/components/ui/button'
import { FieldError, Input, Label, Notice, Spinner } from '@/components/ui/field'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/telimlerim'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null }>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)

    const next = { email: validate.email(email), password: validate.password(password) }
    setErrors(next)
    if (next.email || next.password) return

    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setBusy(false)

    if (error) {
      setFormError(authErrorMessage(error.message))
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <AuthShell
      title="Xoş gəldin"
      subtitle="Təlimlərinə davam etmək üçün hesabına daxil ol."
      footer={
        <>
          Hesabın yoxdur?{' '}
          <Link to="/qeydiyyat" className="font-medium text-primary hover:underline">
            Qeydiyyatdan keç
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {formError && <Notice tone="error">{formError}</Notice>}

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
          <div className="mb-1.5 flex items-baseline justify-between">
            <Label htmlFor="password" className="mb-0">
              Şifrə
            </Label>
            <Link
              to="/sifremi-unutdum"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Şifrəni unutdun?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            aria-invalid={!!errors.password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FieldError>{errors.password}</FieldError>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? <Spinner /> : null}
          {busy ? 'Yoxlanılır…' : 'Daxil ol'}
        </Button>
      </form>
    </AuthShell>
  )
}

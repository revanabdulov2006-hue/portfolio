import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { authErrorMessage, validate } from '@/lib/authErrors'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { FieldError, Input, Label, Notice, Spinner } from '@/components/ui/field'

/**
 * Admin girişi ictimai giriş səhifəsindən ayrıdır.
 * Adi istifadəçi bu formadan daxil olsa belə panelə buraxılmır —
 * rol yoxlaması həm burada, həm RequireAdmin-də, həm də RLS-də var.
 */
export default function AdminLogin() {
  const navigate = useNavigate()
  const { session, profile, loading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null }>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!loading && session && profile?.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)

    const next = { email: validate.email(email), password: validate.password(password) }
    setErrors(next)
    if (next.email || next.password) return

    setBusy(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error || !data.user) {
      setBusy(false)
      setFormError(authErrorMessage(error?.message))
      return
    }

    const { data: prof } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle()

    setBusy(false)

    if (prof?.role !== 'admin') {
      await supabase.auth.signOut()
      setFormError('Bu hesabın admin panelə çıxışı yoxdur.')
      return
    }

    navigate('/admin', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-5">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-background p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-primary">Admin</p>
        <h1 className="mt-3 font-display text-2xl font-bold tracking-tight">Panelə giriş</h1>

        <form onSubmit={onSubmit} noValidate className="mt-7 space-y-5">
          {formError && <Notice tone="error">{formError}</Notice>}

          <div>
            <Label htmlFor="ae">Email</Label>
            <Input
              id="ae"
              type="email"
              autoComplete="email"
              value={email}
              aria-invalid={!!errors.email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FieldError>{errors.email}</FieldError>
          </div>

          <div>
            <Label htmlFor="ap">Şifrə</Label>
            <Input
              id="ap"
              type="password"
              autoComplete="current-password"
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
      </div>
    </div>
  )
}

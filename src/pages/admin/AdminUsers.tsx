import { useEffect, useMemo, useState } from 'react'
import { fetchAdminUsers, type AdminUserRow } from '@/lib/adminQueries'
import { Badge, Input, Notice, Spinner } from '@/components/ui/field'

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('az-AZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function AdminUsers() {
  const [rows, setRows] = useState<AdminUserRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')

  useEffect(() => {
    let active = true
    fetchAdminUsers()
      .then((r) => active && setRows(r))
      .catch((e: Error) => active && setError(e.message))
    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(() => {
    if (!rows) return null
    const needle = q.trim().toLowerCase()
    if (!needle) return rows
    return rows.filter(
      (r) =>
        r.profile.full_name.toLowerCase().includes(needle) ||
        r.profile.email.toLowerCase().includes(needle),
    )
  }, [rows, q])

  if (error) return <Notice tone="error">İstifadəçilər yüklənmədi: {error}</Notice>
  if (!filtered)
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-6 w-6 text-primary" />
      </div>
    )

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight">İstifadəçilər</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {rows?.length ?? 0} qeydiyyat. Hər istifadəçinin kursları və izləmə səviyyəsi.
      </p>

      <div className="mt-6 max-w-sm">
        <Input
          placeholder="Ad və ya email üzrə axtar…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          Nəticə tapılmadı.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-background">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3.5 font-medium">Ad Soyad</th>
                <th className="px-5 py-3.5 font-medium">Email</th>
                <th className="px-5 py-3.5 font-medium">Qeydiyyat</th>
                <th className="px-5 py-3.5 font-medium">Son aktivlik</th>
                <th className="px-5 py-3.5 font-medium">Kurslar və progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(({ profile, courses }) => (
                <tr key={profile.id} className="align-top">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{profile.full_name || '—'}</span>
                      {profile.role === 'admin' && <Badge tone="done">Admin</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{profile.email}</td>
                  <td className="px-5 py-4 tabular-nums text-muted-foreground">
                    {formatDate(profile.created_at)}
                  </td>
                  <td className="px-5 py-4 tabular-nums text-muted-foreground">
                    {formatDate(profile.last_seen_at)}
                  </td>
                  <td className="px-5 py-4">
                    {courses.length === 0 ? (
                      <span className="text-muted-foreground">Kurs yoxdur</span>
                    ) : (
                      <ul className="space-y-2">
                        {courses.map((c) => (
                          <li key={c.slug} className="flex items-center gap-3">
                            <span className="min-w-0 max-w-[220px] truncate">{c.title}</span>
                            <div className="h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-secondary">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${c.percent}%` }}
                              />
                            </div>
                            <span className="shrink-0 tabular-nums text-xs text-muted-foreground">
                              {c.done}/{c.total} · {c.percent}%
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

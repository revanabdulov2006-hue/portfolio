import { useEffect, useState } from 'react'
import { fetchAllCourses, toggleCoursePublished } from '@/lib/adminQueries'
import { CATEGORY_LABELS, type Course } from '@/types/db'
import { Button } from '@/components/ui/button'
import { Badge, Notice, Spinner } from '@/components/ui/field'

export default function AdminCourses() {
  const [rows, setRows] = useState<Course[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function reload() {
    try {
      setRows(await fetchAllCourses())
    } catch (e) {
      setError((e as Error).message)
    }
  }

  useEffect(() => {
    void reload()
  }, [])

  async function onToggle(c: Course) {
    setBusyId(c.id)
    setError(null)
    try {
      await toggleCoursePublished(c.id, !c.is_published)
      await reload()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusyId(null)
    }
  }

  if (!rows && !error)
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-6 w-6 text-primary" />
      </div>
    )

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight">Kurslar</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Kursların dərc statusunu buradan idarə edirsən.
      </p>

      <Notice tone="info">
        <strong>Qeyd:</strong> kurs və dərs əlavə etmək, video/PDF linkləri yazmaq hazırda
        Supabase Dashboard → Table Editor üzərindən edilir. Panelin içindən redaktə forması
        növbəti mərhələdə qurulacaq.
      </Notice>

      {error && (
        <div className="mt-6">
          <Notice tone="error">{error}</Notice>
        </div>
      )}

      {rows && rows.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          Hələ kurs yoxdur. Supabase-də <code>courses</code> cədvəlinə ilk kursu əlavə et.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-background">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3.5 font-medium">Sıra</th>
                <th className="px-5 py-3.5 font-medium">Kurs</th>
                <th className="px-5 py-3.5 font-medium">Kateqoriya</th>
                <th className="px-5 py-3.5 font-medium">Qiymət</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows?.map((c) => (
                <tr key={c.id}>
                  <td className="px-5 py-4 tabular-nums text-muted-foreground">{c.sort_order}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">/{c.slug}</p>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {CATEGORY_LABELS[c.category]}
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={c.is_free ? 'free' : 'paid'}>
                      {c.is_free ? 'Pulsuz' : `${c.price} ${c.currency}`}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={c.is_published ? 'done' : 'neutral'}>
                      {c.is_published ? 'Dərc olunub' : 'Qaralama'}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Button
                      size="sm"
                      variant={c.is_published ? 'outline' : 'primary'}
                      onClick={() => onToggle(c)}
                      disabled={busyId === c.id}
                    >
                      {busyId === c.id ? <Spinner /> : null}
                      {c.is_published ? 'Gizlət' : 'Dərc et'}
                    </Button>
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

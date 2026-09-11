import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import {
  approveRequest,
  fetchAdminRequests,
  revokeAccess,
  setRequestStatus,
  type AdminRequestRow,
} from '@/lib/adminQueries'
import { Button } from '@/components/ui/button'
import { Badge, Notice, Spinner } from '@/components/ui/field'

const STATUS_LABEL: Record<AdminRequestRow['status'], string> = {
  new: 'Yeni',
  contacted: 'Əlaqə saxlanıb',
  approved: 'Təsdiqlənib',
  rejected: 'Rədd edilib',
}

export default function AdminRequests() {
  const [rows, setRows] = useState<AdminRequestRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function reload() {
    try {
      setRows(await fetchAdminRequests())
    } catch (e) {
      setError((e as Error).message)
    }
  }

  useEffect(() => {
    void reload()
  }, [])

  async function onApprove(req: AdminRequestRow) {
    setBusyId(req.id)
    setError(null)
    try {
      await approveRequest(req)
      await reload()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusyId(null)
    }
  }

  async function onRevoke(req: AdminRequestRow) {
    setBusyId(req.id)
    setError(null)
    try {
      await revokeAccess(req)
      await setRequestStatus(req.id, 'rejected')
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
      <h1 className="font-display text-2xl font-bold tracking-tight">Sorğular</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Pullu kurs üçün WhatsApp-dan sifariş edənlər. Ödəniş həll olunandan sonra «Təsdiqlə»
        düyməsi istifadəçiyə kursa çıxış verir.
      </p>

      {error && (
        <div className="mt-6">
          <Notice tone="error">{error}</Notice>
        </div>
      )}

      {rows && rows.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          Hələ sorğu yoxdur.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-background">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3.5 font-medium">Kim</th>
                <th className="px-5 py-3.5 font-medium">Kurs</th>
                <th className="px-5 py-3.5 font-medium">Tarix</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows?.map((r) => (
                <tr key={r.id}>
                  <td className="px-5 py-4">
                    <p className="font-medium">{r.full_name || '—'}</p>
                    <p className="text-xs text-muted-foreground">{r.email}</p>
                  </td>
                  <td className="px-5 py-4">{r.courses?.title ?? '—'}</td>
                  <td className="px-5 py-4 tabular-nums text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString('az-AZ')}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge tone={r.status === 'approved' ? 'done' : 'neutral'}>
                        {STATUS_LABEL[r.status]}
                      </Badge>
                      {r.granted && <Badge tone="free">Çıxış var</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {!r.granted ? (
                        <Button
                          size="sm"
                          onClick={() => onApprove(r)}
                          disabled={busyId === r.id || !r.user_id}
                          title={!r.user_id ? 'Sorğu hesabsız yaradılıb' : undefined}
                        >
                          {busyId === r.id ? <Spinner /> : <Check className="h-4 w-4" />}
                          Təsdiqlə
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRevoke(r)}
                          disabled={busyId === r.id}
                        >
                          {busyId === r.id ? <Spinner /> : <X className="h-4 w-4" />}
                          Çıxışı ləğv et
                        </Button>
                      )}
                    </div>
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

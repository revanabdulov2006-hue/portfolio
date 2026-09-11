import * as React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-12 w-full rounded-xl border border-input bg-background px-4 text-[15px] text-foreground',
        'placeholder:text-muted-foreground/70',
        'transition-[border-color,box-shadow] duration-200',
        'focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/12',
        'disabled:cursor-not-allowed disabled:opacity-60',
        'aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/12',
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('mb-1.5 block text-sm font-medium text-foreground', className)}
      {...props}
    />
  )
}

export function FieldError({ children }: { children?: string | null }) {
  if (!children) return null
  return <p className="mt-1.5 text-sm text-destructive">{children}</p>
}

/** Forma səviyyəsində xəta / uğur mesajı. */
export function Notice({
  tone = 'error',
  children,
}: {
  tone?: 'error' | 'success' | 'info'
  children: React.ReactNode
}) {
  if (!children) return null
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-xl border px-4 py-3 text-sm',
        tone === 'error' && 'border-destructive/25 bg-destructive/8 text-destructive',
        tone === 'success' && 'border-primary/25 bg-accent text-accent-foreground',
        tone === 'info' && 'border-border bg-secondary text-secondary-foreground',
      )}
    >
      {children}
    </div>
  )
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Yüklənir"
      className={cn(
        'inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent',
        className,
      )}
    />
  )
}

export function Badge({
  tone = 'neutral',
  children,
}: {
  tone?: 'free' | 'paid' | 'neutral' | 'done'
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        tone === 'free' && 'bg-primary text-primary-foreground',
        tone === 'paid' && 'bg-cream text-cream-foreground',
        tone === 'done' && 'bg-accent text-accent-foreground',
        tone === 'neutral' && 'bg-secondary text-secondary-foreground',
      )}
    >
      {children}
    </span>
  )
}

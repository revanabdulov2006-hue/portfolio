import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium ' +
    'transition-[transform,background-color,color,box-shadow] duration-200 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
    'focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 ' +
    'active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        /**
         * Əsas CTA — qradiyent pill, içəridən işıqlı, kənarında incə ağ xətt.
         * Yalnız səhifədə bir dəfə işlədilir ki, vurğu dağılmasın.
         */
        gradient:
          'text-white uppercase tracking-widest font-medium ' +
          'bg-[linear-gradient(123deg,hsl(218_60%_14%)_4%,hsl(213_92%_44%)_42%,hsl(203_88%_50%)_74%,hsl(190_80%_58%)_100%)] ' +
          'shadow-[0_4px_4px_hsl(213_92%_44%/0.25),4px_4px_14px_hsl(203_88%_52%/0.55)_inset] ' +
          'outline outline-2 -outline-offset-[3px] outline-white/85 ' +
          'hover:brightness-110',
        /** Kart üzərində sakit kontur düymə. */
        ghostOutline:
          'border-2 border-foreground/70 text-foreground uppercase tracking-widest ' +
          'hover:bg-foreground/10',
        outline: 'border border-border bg-background text-foreground hover:bg-secondary',
        ghost: 'text-muted-foreground hover:bg-secondary hover:text-foreground',
        cream: 'bg-cream text-cream-foreground hover:brightness-[0.97]',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-14 px-8 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
)
Button.displayName = 'Button'

export { buttonVariants }

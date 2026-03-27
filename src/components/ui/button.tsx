"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-transparent bg-clip-padding text-sm font-bold whitespace-nowrap outline-none select-none transition-all duration-200 ease-out focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/45 enabled:hover:scale-[1.02] enabled:active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:scale-100 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg shadow-black/25 [a]:hover:bg-primary/90 hover:shadow-[var(--shadow-lumis-accent),0_8px_24px_rgba(0,0,0,0.35)]",
        outline:
          "border-[var(--lumis-border)] bg-white/[0.04] font-semibold text-foreground shadow-md backdrop-blur-sm hover:border-white/15 hover:bg-white/[0.08] aria-expanded:bg-white/[0.08] dark:hover:bg-white/[0.07]",
        secondary:
          "border border-[var(--lumis-border)] bg-secondary/80 font-semibold text-secondary-foreground shadow-md backdrop-blur-sm hover:bg-secondary hover:shadow-lg aria-expanded:bg-secondary",
        ghost:
          "rounded-xl font-semibold text-foreground hover:bg-white/[0.06] aria-expanded:bg-white/[0.06] dark:hover:bg-white/[0.05]",
        destructive:
          "rounded-2xl bg-destructive/15 font-semibold text-destructive shadow-md hover:bg-destructive/25 focus-visible:border-destructive/40 focus-visible:ring-destructive/25 dark:bg-destructive/25 dark:hover:bg-destructive/35",
        link: "rounded-none font-semibold text-[var(--lumis-accent)] underline underline-offset-4 hover:scale-100 active:scale-100 hover:text-[var(--lumis-accent-dim)]",
      },
      size: {
        default: "h-9 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-xl px-3 text-xs in-data-[slot=button-group]:rounded-2xl has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-xl px-3.5 text-[0.8rem] in-data-[slot=button-group]:rounded-2xl has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 px-6 text-base has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        icon: "size-10 rounded-2xl",
        "icon-xs": "size-7 rounded-xl in-data-[slot=button-group]:rounded-2xl [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-2xl in-data-[slot=button-group]:rounded-2xl",
        "icon-lg": "size-11 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant = "default",
  size = "default",
  loading = false,
  children,
  disabled,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
  }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled ?? loading}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : null}
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }

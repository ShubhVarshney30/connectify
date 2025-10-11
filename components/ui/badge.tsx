import type * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        "outline-strong":
          "text-foreground border-foreground/20 bg-background/40 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md shadow-sm [a&]:hover:bg-foreground/5",
        glass:
          "border-white/20 dark:border-white/10 bg-background/40 text-foreground/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
        subtle: "border-transparent bg-muted text-muted-foreground [a&]:hover:bg-muted/90",
      },
      size: {
        sm: "[&>svg]:size-3 px-2 py-0.5 text-[11px] leading-none",
        md: "[&>svg]:size-[14px] px-2.5 py-1 text-xs leading-tight",
      },
      radius: {
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "outline-strong",
      size: "md",
      radius: "lg",
    },
  },
)

function Badge({
  className,
  variant,
  size,
  radius,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant, size, radius }), className)} {...props} />
}

export { Badge, badgeVariants }

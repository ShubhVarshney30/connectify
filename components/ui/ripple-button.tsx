"use client"

import type React from "react"

import { forwardRef, type MouseEvent, useRef } from "react"
import { cn } from "@/lib/utils"

export interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "success" | "danger" | "glass"
}

export const RippleButton = forwardRef<HTMLButtonElement, RippleButtonProps>(function RippleButton(
  { className, children, variant = "primary", ...props },
  ref,
) {
  const btnRef = useRef<HTMLButtonElement | null>(null)

  function onClick(e: MouseEvent<HTMLButtonElement>) {
    const button = btnRef.current
    if (!button) return
    const circle = document.createElement("span")
    const diameter = Math.max(button.clientWidth, button.clientHeight)
    const radius = diameter / 2
    circle.style.width = circle.style.height = `${diameter}px`
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`
    circle.className = "ripple"
    const ripple = button.getElementsByClassName("ripple")[0]
    if (ripple) ripple.remove()
    button.appendChild(circle)
    props.onClick?.(e)
  }

  const variants = {
    primary: "bg-gradient-to-r from-[#0066FF] to-[#00BFFF] text-white",
    success: "bg-[#00D9A3] text-white",
    danger: "bg-[#FF3B5C] text-white",
    glass: "bg-white/10 backdrop-blur-md border border-white/10 text-foreground",
  }

  return (
    <button
      {...props}
      ref={(node) => {
        btnRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) (ref as any).current = node
      }}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-xl px-4 py-2 text-sm font-medium shadow transition active:scale-95",
        variants[variant],
        className,
      )}
    >
      <style jsx>{`
        .ripple {
          position: absolute;
          border-radius: 9999px;
          transform: scale(0);
          animation: ripple 600ms ease-out;
          background: rgba(255, 255, 255, 0.4);
          pointer-events: none;
        }
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
      {children}
    </button>
  )
})

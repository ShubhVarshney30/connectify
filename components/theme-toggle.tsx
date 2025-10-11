"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const dark = resolvedTheme === "dark"
  const toggle = () => setTheme(dark ? "light" : "dark")

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      aria-pressed={dark}
      className={[
        "group relative inline-flex h-10 w-10 items-center justify-center rounded-full",
        "backdrop-blur-xl border border-white/30 dark:border-white/15",
        "bg-white/60 dark:bg-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]",
        "transition-colors duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]",
        className || "",
      ].join(" ")}
    >
      <div className="relative h-5 w-5">
        <Sun
          className={`absolute inset-0 h-5 w-5 text-foreground transition-all duration-300 ${dark ? "scale-0 opacity-0 rotate-90" : "scale-100 opacity-100 rotate-0"}`}
        />
        <Moon
          className={`absolute inset-0 h-5 w-5 text-foreground transition-all duration-300 ${dark ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 -rotate-90"}`}
        />
      </div>
    </button>
  )
}

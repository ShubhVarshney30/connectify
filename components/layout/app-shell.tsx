"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Home, Activity, MessageCircle, Vote, Trophy, User, PhoneCall } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

const nav = [
  { href: "/community", label: "Community", icon: Home },
  { href: "/sos", label: "SOS Alerts", icon: PhoneCall },
  { href: "/resources", label: "Resources", icon: Activity },
  { href: "/chat", label: "AI Chat", icon: MessageCircle },
  { href: "/polls", label: "Polls", icon: Vote },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 py-6">
          {/* Glass Sidebar */}
          <aside
            className="hidden md:block sticky top-6 h-[calc(100dvh-3rem)] rounded-2xl glass-surface shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
            aria-label="Primary navigation"
          >
            <div className="p-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00BFFF] shadow-lg" />
                <div className="text-sm font-semibold">
                  Connect<span className="text-primary"> & Thrive</span>
                </div>
              </Link>
            </div>
            <nav className="px-2 pb-4">
              <ul className="space-y-1">
                {nav.map((item) => {
                  const active = pathname?.startsWith(item.href)
                  const Icon = item.icon
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition",
                          active
                            ? "bg-gradient-to-r from-[#0066FF]/20 to-[#00BFFF]/20 ring-1 ring-[#00BFFF]/20"
                            : "hover:bg-white/5",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 text-muted-foreground group-hover:scale-105 transition",
                            active && "text-primary",
                          )}
                        />
                        <span
                          className={cn("text-sm", active ? "text-foreground font-medium" : "text-muted-foreground")}
                        >
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
            <div className="mt-auto p-4 flex items-center justify-between">
              <button
                className="relative inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#FF3B5C] ring-2 ring-background animate-pulse" />
              </button>
              <ThemeToggle />
            </div>
          </aside>

          <main className="space-y-6">
            {/* Top bar (mobile) */}
            <div className="md:hidden sticky top-0 z-10 -mx-4 px-4 py-3 border-b bg-background backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-[#0066FF] to-[#00BFFF]" />
                  <div className="text-sm font-semibold">Connect & Thrive</div>
                </Link>
                <div className="flex items-center gap-2">
                  <button
                    className="relative inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:text-foreground transition"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-0.5 -right-0.5 inline-flex h-2 w-2 rounded-full bg-[#FF3B5C] ring-2 ring-background" />
                  </button>
                  <ThemeToggle />
                </div>
              </div>
            </div>
            {children}
            {/* Bottom glass nav (mobile) */}
            <div className="md:hidden h-16" />
            <nav className="md:hidden fixed bottom-3 left-0 right-0 mx-4 z-20">
              <div className="rounded-2xl glass-surface shadow-xl">
                <ul className="grid grid-cols-5">
                  {nav.slice(0, 5).map((item) => {
                    const active = pathname?.startsWith(item.href)
                    const Icon = item.icon
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex flex-col items-center justify-center gap-1 py-2 text-xs",
                            active ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          <div
                            className={cn(
                              "rounded-xl p-2 transition",
                              active ? "bg-white/20" : "group-active:scale-95",
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          {item.label.split(" ")[0]}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </nav>
          </main>
        </div>
      </div>
    </div>
  )
}

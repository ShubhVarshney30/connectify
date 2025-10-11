"use client"

import { AppShell } from "@/components/layout/app-shell"
import { useEffect, useState } from "react"
import { RippleButton } from "@/components/ui/ripple-button"

export default function SOSPage() {
  const [confirm, setConfirm] = useState(false)
  const [count, setCount] = useState(3)

  useEffect(() => {
    if (!confirm) return
    setCount(3)
    const id = setInterval(() => setCount((c) => (c > 0 ? c - 1 : 0)), 900)
    return () => clearInterval(id)
  }, [confirm])

  useEffect(() => {
    if (confirm && count === 0) {
      setConfirm(false)
      // trigger a mock alert submission
      fetch("/api/sos", { method: "POST" })
    }
  }, [confirm, count])

  return (
    <AppShell>
      <section className="grid place-items-center rounded-2xl border border-white/10 bg-white/10 dark:bg-black/30 backdrop-blur-xl p-8">
        <button
          onClick={() => setConfirm(true)}
          className="relative h-52 w-52 rounded-full bg-gradient-to-br from-[#FF3B5C] to-[#FF6B7C] text-white text-2xl font-extrabold shadow-2xl ring-4 ring-[#FF3B5C]/30 transition active:scale-95"
          aria-label="Send SOS"
        >
          <span className="absolute inset-0 rounded-full animate-ping bg-[#FF3B5C]/30" />
          <span className="absolute inset-0 rounded-full animate-[pulse_2s_ease-in-out_infinite] ring-2 ring-white/20" />
          <span className="relative">SEND SOS</span>
        </button>

        {confirm && (
          <div className="fixed inset-0 z-50 grid place-items-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirm(false)} />
            <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/10 dark:bg-black/30 backdrop-blur-xl p-6 text-center">
              <h2 className="text-lg font-bold text-foreground">Confirm SOS</h2>
              <p className="mt-1 text-sm text-muted-foreground">Dispatching in...</p>
              <div className="mt-4 text-5xl font-extrabold text-[#FF3B5C]">{count}</div>
              <div className="mt-4 flex justify-center gap-2">
                <RippleButton variant="danger" onClick={() => setConfirm(false)}>
                  Cancel
                </RippleButton>
                <RippleButton onClick={() => setCount(0)}>Send Now</RippleButton>
              </div>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  )
}

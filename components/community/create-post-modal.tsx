"use client"

import * as React from "react"
import { X } from "lucide-react"
import { RippleButton } from "@/components/ui/ripple-button"
import { cn } from "@/lib/utils"

export function CreatePostModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [tab, setTab] = React.useState<"general" | "question" | "resource">("general")
  const [text, setText] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  if (!open) return null

  const submit = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    onOpenChange(false)
  }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-white/10 dark:bg-black/30 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 className="text-base font-semibold">Create Post</h2>
          <button onClick={() => onOpenChange(false)} aria-label="Close">
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </button>
        </div>

        <div className="px-4 pt-3">
          <div className="flex gap-2">
            {(["general", "question", "resource"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs transition ring-1 ring-white/10",
                  tab === k
                    ? "bg-gradient-to-r from-[#0066FF]/20 to-[#00BFFF]/20 text-primary"
                    : "text-muted-foreground hover:bg-white/5",
                )}
              >
                {k[0].toUpperCase() + k.slice(1)}
              </button>
            ))}
          </div>

          <div className="mt-3">
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind?"
                className="min-h-36 w-full resize-none rounded-xl border border-white/10 bg-transparent p-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-[#00BFFF]/30"
              />
              <div className="pointer-events-none absolute bottom-2 right-3 text-xs text-muted-foreground">
                {text.length}/280
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
          <div className="text-xs text-muted-foreground">
            <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-1">AI Guardian Active</span>
          </div>
          <RippleButton onClick={submit} disabled={loading}>
            {loading ? "Posting..." : "Submit Post"}
          </RippleButton>
        </div>
      </div>
    </div>
  )
}

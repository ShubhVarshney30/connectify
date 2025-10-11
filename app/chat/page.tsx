"use client"

import { AppShell } from "@/components/layout/app-shell"
import { useEffect, useMemo, useRef, useState } from "react"
import useSWRMutation from "swr/mutation"
import { cn } from "@/lib/utils"
import { Trash2, ArrowDown, Bot, ShieldCheck, Sparkles, Send, Copy } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Msg = { role: "user" | "assistant"; content: string }
type UIMsg = Msg & { id: string; at: number }

export default function ChatPage() {
  const [messages, setMessages] = useState<UIMsg[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Hey! I’m your AI guide. Ask me anything about the community.",
      at: Date.now(),
    },
  ])
  const listRef = useRef<HTMLDivElement | null>(null)
  const endRef = useRef<HTMLDivElement | null>(null)
  const [showScroll, setShowScroll] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  const { trigger, isMutating } = useSWRMutation("/api/chat", async (url, { arg }: { arg: { messages: Msg[] } }) => {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(arg),
      headers: { "Content-Type": "application/json" },
    })
    return (await res.json()) as { reply: string }
  })

  const scrollToBottom = () => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  useEffect(() => {
    scrollToBottom()
  }, [messages.length, isMutating])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const onScroll = () => {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80
      setShowScroll(!nearBottom)
    }
    el.addEventListener("scroll", onScroll)
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  async function onSend(text: string) {
    const you: UIMsg = { id: crypto.randomUUID(), role: "user", content: text, at: Date.now() }
    const next = [...messages, you]
    setMessages(next)
    const { reply } = await trigger({ messages: next.map(({ role, content }) => ({ role, content })) })
    const ai: UIMsg = { id: crypto.randomUUID(), role: "assistant", content: reply, at: Date.now() }
    setMessages((cur) => [...cur, ai])
  }

  function onClear() {
    if (!confirmClear) {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 700)
      return
    }
    setMessages([
      { id: crypto.randomUUID(), role: "assistant", content: "Cleared. How can I help now?", at: Date.now() },
    ])
    setConfirmClear(false)
  }

  return (
    <AppShell>
      <div
        className={cn("rounded-2xl border p-3 mb-3 backdrop-blur-xl", "glass-surface", confirmClear && "animate-shake")}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="grid place-items-center h-8 w-8 rounded-lg chip">
              <Bot className="h-4.5 w-4.5" aria-hidden />
            </div>
            <h2 className="text-sm font-semibold text-pretty">
              <span className="gradient-text-strong">AI Assistant</span>
            </h2>
            <div className="hidden md:flex items-center gap-2">
              <Badge variant="outline-strong" size="sm" className="uppercase tracking-wide">
                <Sparkles className="h-4 w-4" aria-hidden />
                gpt-5-mini
              </Badge>
              <Badge variant="outline-strong" size="sm" className="uppercase tracking-wide">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-primary)] mr-1"
                  aria-hidden
                />
                Live
              </Badge>
              <Badge variant="outline-strong" size="sm" className="uppercase tracking-wide">
                <ShieldCheck className="h-4 w-4" aria-hidden />
                Safe
              </Badge>
            </div>
          </div>
          <button
            onClick={onClear}
            className="inline-flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg chip hover:opacity-90 transition"
            aria-label={confirmClear ? "Confirm clear messages" : "Clear conversation"}
            title={confirmClear ? "Confirm clear" : "Clear conversation"}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            {confirmClear ? "Tap to confirm" : "Clear"}
          </button>
        </div>
      </div>

      <div className="relative grid h-[70dvh] grid-rows-[1fr_auto] rounded-2xl border glass-surface">
        <div
          ref={listRef}
          className="overflow-y-auto space-y-4 p-4"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          {messages.map((m) => (
            <MessageItem key={m.id} msg={m} />
          ))}
          {isMutating && <TypingBubble />}
          <div ref={endRef} />
        </div>

        {showScroll && (
          <button
            onClick={scrollToBottom}
            className="absolute right-4 bottom-20 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/60 dark:bg-white/10 backdrop-blur-xl text-xs px-3 py-1.5 shadow hover:translate-y-[-1px] transition"
            aria-label="Scroll to newest messages"
          >
            <ArrowDown className="h-4 w-4" aria-hidden /> New messages
          </button>
        )}

        <ChatInput onSend={onSend} disabled={isMutating} />
      </div>
    </AppShell>
  )
}

function MessageItem({ msg }: { msg: UIMsg }) {
  const isUser = msg.role === "user"
  const time = new Date(msg.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  return (
    <div className={cn("flex items-end gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && <Avatar seed="AI" />}
      <div
        className={cn(
          "relative max-w-[78%] rounded-2xl px-3 py-2 text-sm shadow group",
          isUser ? "text-white" : "glass-surface",
        )}
        style={
          isUser
            ? { background: "linear-gradient(90deg, var(--brand-primary-start), var(--brand-primary-end))" }
            : undefined
        }
      >
        {!isUser && (
          <div className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition">
            <CopyButton text={msg.content} />
          </div>
        )}
        <p className="text-pretty">{msg.content}</p>
        <div className={cn("mt-1 text-[10px] opacity-70", isUser ? "text-white/80" : "text-foreground/70")}>{time}</div>
        <span
          aria-hidden
          className={cn(
            "absolute bottom-2 h-3 w-3 rotate-45 rounded-[2px]",
            isUser ? "right-[-6px]" : "left-[-6px] border",
          )}
          style={
            isUser
              ? { background: "linear-gradient(90deg, var(--brand-primary-start), var(--brand-primary-end))" }
              : undefined
          }
        />
      </div>
      {isUser && <Avatar seed="You" />}
    </div>
  )
}

function Avatar({ seed }: { seed: string }) {
  const initials = useMemo(
    () =>
      seed
        .split(" ")
        .map((s) => s[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [seed],
  )
  return (
    <div className="grid place-items-center h-7 w-7 rounded-full border border-white/10 bg-white/20 dark:bg-white/10 backdrop-blur-md text-[10px] font-semibold">
      {initials}
    </div>
  )
}

function ChatInput({ onSend, disabled }: { onSend: (t: string) => void; disabled: boolean }) {
  const [v, setV] = useState("")
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!v.trim()) return
        onSend(v.trim())
        setV("")
      }}
      className="rounded-xl border border-white/10 bg-white/10 dark:bg-black/30 backdrop-blur-md p-2 flex items-center gap-2"
      role="search"
      aria-label="Chat input"
    >
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="Write a message..."
        className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
        aria-label="Message"
      />
      <button
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-white disabled:opacity-50 active:scale-95 transition"
        style={{ background: "linear-gradient(90deg, var(--brand-primary-start), var(--brand-primary-end))" }}
        aria-label="Send message"
      >
        <Send className="h-4 w-4" aria-hidden />
        Send
      </button>
    </form>
  )
}

function TypingBubble() {
  return (
    <div className="flex items-end gap-2">
      <Avatar seed="AI" />
      <div className="max-w-[60%] rounded-2xl px-3 py-2 text-sm border border-white/10 bg-white/10 dark:bg-black/30 backdrop-blur-md">
        <div className="mb-1">
          <Badge variant="subtle" size="sm" className="uppercase tracking-wide">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            AI typing
          </Badge>
        </div>
        <div className="typing-dots" aria-hidden>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 900)
        } catch {}
      }}
      className="inline-flex items-center gap-1 chip px-2 py-1 text-[10px] hover:opacity-90 transition"
      aria-label={copied ? "Copied" : "Copy message"}
      title={copied ? "Copied" : "Copy"}
    >
      <Copy className="h-4 w-4" aria-hidden />
      {copied ? "Copied" : "Copy"}
    </button>
  )
}

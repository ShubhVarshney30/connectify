"use client"

import useSWR from "swr"
import { AppShell } from "@/components/layout/app-shell"
import { useState } from "react"

type Poll = {
  id: string
  question: string
  options: { id: string; label: string; votes: number }[]
  total: number
  endsIn: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function PollsPage() {
  const { data } = useSWR<Poll[]>("/api/polls", fetcher)

  return (
    <AppShell>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data?.map((poll) => (
          <PollCard key={poll.id} poll={poll} />
        ))}
        {!data &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-56 rounded-2xl border border-white/10 bg-white/10 dark:bg-black/30 animate-pulse"
            />
          ))}
      </div>
    </AppShell>
  )
}

function PollCard({ poll }: { poll: Poll }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [voted, setVoted] = useState(false)

  const total = poll.total + (voted ? 1 : 0)
  const options = poll.options.map((o) => ({
    ...o,
    votes: o.votes + (voted && selected === o.id ? 1 : 0),
  }))

  return (
    <article className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/0 p-4 shadow backdrop-blur-xl">
      <h3 className="text-lg font-bold">{poll.question}</h3>
      <p className="mt-1 text-xs text-muted-foreground">Ends in {poll.endsIn}</p>

      <div className="mt-4 space-y-2">
        {options.map((o) => {
          const pct = Math.round((o.votes / total) * 100)
          const active = selected === o.id
          return (
            <button
              key={o.id}
              disabled={voted}
              onClick={() => setSelected(o.id)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-2 text-left text-sm hover:bg-white/10 transition disabled:opacity-85"
            >
              <div className="flex items-center justify-between">
                <span className={active ? "text-foreground font-medium" : "text-foreground/90"}>{o.label}</span>
                {voted && <span className="text-xs text-muted-foreground">{pct}%</span>}
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0066FF] to-[#00BFFF] transition-[width] duration-700"
                  style={{ width: voted ? `${pct}%` : "0%" }}
                />
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Total votes: {total.toLocaleString()}</span>
        <button
          onClick={() => selected && setVoted(true)}
          disabled={!selected || voted}
          className="rounded-lg bg-gradient-to-r from-[#0066FF] to-[#00BFFF] px-3 py-1 text-white disabled:opacity-50 active:scale-95 transition"
        >
          {voted ? "Voted" : "Submit Vote"}
        </button>
      </div>
    </article>
  )
}

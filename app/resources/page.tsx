"use client"

import useSWR from "swr"
import { AppShell } from "@/components/layout/app-shell"

type Resource = {
  id: string
  title: string
  image: string
  distance: string
  category: string
  score: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ResourcesPage() {
  const { data } = useSWR<Resource[]>("/api/resources", fetcher)

  return (
    <AppShell>
      <section className="rounded-2xl border border-white/10 bg-white/10 dark:bg-black/30 p-4">
        <h1 className="text-xl font-extrabold">Resource Exchange</h1>
        <p className="text-sm text-muted-foreground">Discover items and skills nearby.</p>
      </section>

      <section className="columns-1 md:columns-2 xl:columns-3 gap-6 [column-fill:_balance] space-y-6">
        {data?.map((r) => (
          <article
            key={r.id}
            className="break-inside-avoid rounded-2xl border border-white/10 bg-white/10 dark:bg-black/30 overflow-hidden"
          >
            <img src={r.image || "/placeholder.svg"} alt="" className="w-full h-auto" />
            <div className="p-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{r.title}</h3>
                <span className="text-xs text-muted-foreground">{r.distance}</span>
              </div>
              <div className="mt-1 text-xs text-primary">{r.category}</div>
              <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00D9A3] to-[#00BFFF]"
                  style={{ width: `${r.score}%` }}
                />
              </div>
            </div>
          </article>
        ))}
        {!data &&
          Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="break-inside-avoid h-64 rounded-2xl border border-white/10 bg-white/10 dark:bg-black/30 animate-pulse"
            />
          ))}
      </section>
    </AppShell>
  )
}

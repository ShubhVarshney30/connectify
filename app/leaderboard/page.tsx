"use client"

import useSWR from "swr"
import { AppShell } from "@/components/layout/app-shell"

type Entry = { rank: number; name: string; avatar: string; points: number }

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function LeaderboardPage() {
  const { data } = useSWR<Entry[]>("/api/leaderboard", fetcher)
  const top = data?.slice(0, 3) ?? []
  const rest = data?.slice(3) ?? []

  return (
    <AppShell>
      <section className="rounded-2xl border border-white/10 bg-white/10 dark:bg-black/30 backdrop-blur-xl p-6">
        <h1 className="text-2xl font-extrabold">Leaderboard</h1>
        {/* Podium */}
        <div className="mt-6 grid grid-cols-3 gap-4 items-end">
          {top.map((e, i) => (
            <div key={e.rank} className="text-center">
              <img
                src={e.avatar || "/placeholder.svg"}
                alt=""
                className="mx-auto h-16 w-16 rounded-full ring-2 ring-white/20"
              />
              <p className="mt-2 text-sm font-semibold">{e.name}</p>
              <p className="text-xs text-muted-foreground">{e.points.toLocaleString()} pts</p>
              <div
                className={`mx-auto mt-3 w-full rounded-t-xl bg-gradient-to-t from-[#0066FF]/20 to-[#00BFFF]/20 ${i === 0 ? "h-24" : "h-16"} ${i === 2 ? "h-12" : ""}`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Table */}
      <section className="rounded-2xl border border-white/10 bg-white/10 dark:bg-black/30 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Points</th>
              </tr>
            </thead>
            <tbody>
              {rest.map((e) => (
                <tr key={e.rank} className="border-t border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3">{e.rank}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={e.avatar || "/placeholder.svg"} alt="" className="h-7 w-7 rounded-full" />
                      <span>{e.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{e.points.toLocaleString()}</td>
                </tr>
              ))}
              {!data &&
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="px-4 py-3">
                      <div className="h-4 w-10 bg-white/10 rounded animate-pulse" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  )
}

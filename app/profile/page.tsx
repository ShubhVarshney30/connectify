"use client"

import { AppShell } from "@/components/layout/app-shell"

export default function ProfilePage() {
  return (
    <AppShell>
      <header className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#0066FF]/20 to-[#00BFFF]/20 p-0">
        <div className="h-32 w-full bg-[url('/profile-banner.png')] bg-cover bg-center" />
        <div className="p-4 flex items-end gap-3">
          <img src="/diverse-avatars.png" alt="" className="h-20 w-20 rounded-full ring-2 ring-white/50 -mt-10" />
          <div>
            <h1 className="text-xl font-extrabold">Alex Johnson</h1>
            <p className="text-xs text-muted-foreground">Community: Downtown • Trust 4.8/5</p>
          </div>
          <div className="ml-auto">
            <button className="rounded-xl bg-white/10 px-3 py-1.5 text-sm ring-1 ring-white/10">Edit</button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Posts", "Resources", "Helped"].map((l, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/10 dark:bg-black/30 p-4">
            <p className="text-xs text-muted-foreground">{l}</p>
            <p className="mt-1 text-2xl font-extrabold">{[124, 56, 32][i]}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/10 dark:bg-black/30 p-4">
        <h2 className="text-sm font-semibold">Recent Activity</h2>
        <ul className="mt-3 space-y-3">
          {[
            { t: "Shared a resource: Free first-aid course", d: "2h ago" },
            { t: "Responded to SOS near Main St", d: "1d ago" },
            { t: "Started a poll: Best emergency kit item?", d: "2d ago" },
          ].map((a, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <div>
                <p className="text-sm">{a.t}</p>
                <p className="text-xs text-muted-foreground">{a.d}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  )
}

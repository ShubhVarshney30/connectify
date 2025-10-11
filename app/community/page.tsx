"use client"

import useSWR from "swr"
import { AppShell } from "@/components/layout/app-shell"
import { RippleButton } from "@/components/ui/ripple-button"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { CreatePostModal } from "@/components/community/create-post-modal"
import { FeedCard, type FeedPost } from "@/components/community/feed-card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function CommunityPage() {
  const { data: stats } = useSWR<{ members: number; resources: number; responseMs: number }>("/api/stats", fetcher)
  const { data: posts } = useSWR<FeedPost[]>("/api/posts", fetcher)
  const [open, setOpen] = useState(false)

  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0066FF]/10 to-[#00BFFF]/10 p-6">
        <h1 className="text-balance text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#0066FF] to-[#00BFFF]">
          Your Community, Connected
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Share updates, resources, and get instant support from trusted members.
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard label="Active Members" value={stats?.members ?? 0} />
          <StatCard label="Resources Shared" value={stats?.resources ?? 0} />
          <StatCard label="Avg Response Time" value={stats ? Math.round(stats.responseMs / 1000) : 0} suffix="s" />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <RippleButton onClick={() => setOpen(true)} className="shadow-lg">
            Create Post
          </RippleButton>
          <RippleButton variant="success">Share Resource</RippleButton>
          <RippleButton variant="danger" className="animate-pulse">
            SOS EMERGENCY
          </RippleButton>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {posts?.map((p) => (
          <FeedCard key={p.id} post={p} />
        ))}
        {!posts && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </section>

      <CreatePostModal open={open} onOpenChange={setOpen} />
    </AppShell>
  )
}

import { useState } from "react"

function StatCard({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 dark:bg-black/30 backdrop-blur-xl p-4 shadow">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-foreground">
        <AnimatedNumber value={value} />
        {suffix}
      </p>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/10 dark:bg-black/30 backdrop-blur-xl" />
  )
}

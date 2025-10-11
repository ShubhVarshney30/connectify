"use client"

import { Heart, MessageCircle, Share2, BadgeCheck } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export interface FeedPost {
  id: string
  user: { name: string; avatar: string; verified?: boolean; online?: boolean }
  category: string
  content: string
  image?: string
  createdAt: string
  likes: number
  comments: number
  shares: number
  aiSummary?: string
  flagged?: boolean
}

export function FeedCard({ post }: { post: FeedPost }) {
  const [likes, setLikes] = useState(post.likes)
  const [liked, setLiked] = useState(false)
  const [expanded, setExpanded] = useState(false)

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-white/10 dark:bg-black/30 backdrop-blur-xl",
        "border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition hover:-translate-y-1 hover:shadow-xl",
      )}
    >
      {post.flagged && (
        <div className="absolute inset-x-0 top-0 z-10 bg-[linear-gradient(45deg,#FFB800,transparent_20%,#FFB800_40%,transparent_60%)] bg-[length:20px_20px] h-8 animate-pulse opacity-70" />
      )}
      <div className="p-4">
        <header className="flex items-center gap-3">
          <div className="relative">
            <Image
              src={post.user.avatar || "/placeholder.svg"}
              alt=""
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            {post.user.online && (
              <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-[#00D9A3] ring-2 ring-background animate-pulse" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <p className="truncate font-semibold text-foreground">{post.user.name}</p>
              {post.user.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
            </div>
            <p className="text-xs text-muted-foreground">{post.createdAt}</p>
          </div>
          <div className="ml-auto">
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#0066FF]/15 to-[#00BFFF]/15 px-2 py-1 text-xs text-primary ring-1 ring-[#00BFFF]/20">
              {post.category}
            </span>
          </div>
        </header>

        <div className="mt-3 text-sm leading-relaxed text-pretty text-foreground/90">{post.content}</div>

        {post.image && (
          <div className="mt-3 overflow-hidden rounded-xl">
            <Image
              src={post.image || "/placeholder.svg"}
              alt=""
              width={1200}
              height={800}
              className="h-auto w-full object-cover transition group-hover:scale-[1.02]"
            />
          </div>
        )}

        {post.aiSummary && (
          <div className="mt-3">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-xs text-primary underline-offset-4 hover:underline"
            >
              {expanded ? "Hide AI Summary" : "AI Summarized"}
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300",
                expanded ? "grid-rows-[1fr] mt-2" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-3 text-xs text-muted-foreground">
                  {post.aiSummary}
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-4 flex items-center gap-4">
          <button
            className={cn(
              "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition active:scale-95",
              liked && "text-[#FF3B5C]",
            )}
            onClick={() => {
              setLiked((v) => !v)
              setLikes((n) => n + (liked ? -1 : 1))
            }}
            aria-pressed={liked}
          >
            <Heart className={cn("h-5 w-5", liked && "fill-[#FF3B5C]")} />
            <span>{likes}</span>
          </button>
          <button className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition active:scale-95">
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments}</span>
          </button>
          <button className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition active:scale-95">
            <Share2 className="h-5 w-5" />
            <span>{post.shares}</span>
          </button>
        </footer>
      </div>
    </article>
  )
}

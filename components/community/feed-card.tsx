"use client"

import { Heart, MessageCircle, Share2, BadgeCheck, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import type { PostWithAuthor } from "@/types/database"

export interface FeedPost {
  id: string
  user: {
    name: string
    avatar: string
    verified: boolean
    online: boolean
  }
  category: string
  content: string
  description?: string
  image?: string
  location?: string
  createdAt: string
  likes: number
  comments: number
  shares: number
  aiSummary?: string
  flagged?: boolean
  urgent?: boolean
  featured?: boolean
}

export function FeedCard({ post }: { post: FeedPost | PostWithAuthor }) {
  const { user } = useAuth()
  const [likes, setLikes] = useState<number>('likes' in post ? post.likes : (post as any).likes_count || 0)
  const [liked, setLiked] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [comments, setComments] = useState(0)

  useEffect(() => {
    // Comments count is already provided by the API
    setComments('comments' in post ? post.comments : (post as any).comments_count || 0)
  }, [post])

  const handleLike = async () => {
    if (!user || !('id' in post)) return

    try {
      const action = liked ? 'unlike' : 'like'
      const response = await fetch('/api/posts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post.id,
          action
        }),
      })

      if (response.ok) {
        const { likes: newLikes } = await response.json()
        setLikes(newLikes)
        setLiked(!liked)
      }
    } catch (error) {
      console.error('Error updating like:', error)
    }
  }

  // Determine if this is a new Post type or old FeedPost type
  const isNewPost = 'author_id' in post
  const displayName = isNewPost ? (post as PostWithAuthor).author?.full_name || 'Anonymous' : (post as FeedPost).user.name
  const avatar = isNewPost ? (post as PostWithAuthor).author?.avatar_url || '/placeholder.svg' : (post as FeedPost).user.avatar
  const isVerified = isNewPost ? (post as PostWithAuthor).author?.is_verified || false : (post as FeedPost).user.verified
  const createdAt = isNewPost ? new Date(post.created_at).toLocaleString() : (post as FeedPost).createdAt
  const category = isNewPost ? post.category : (post as FeedPost).category
  const content = isNewPost ? post.content : (post as FeedPost).content
  const image = isNewPost ? post.image_url : (post as FeedPost).image
  const location = isNewPost ? post.location : (post as FeedPost).location
  const aiSummary = isNewPost ? undefined : (post as FeedPost).aiSummary
  const isFlagged = isNewPost ? post.status === 'flagged' : (post as FeedPost).flagged

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-white/10 dark:bg-black/30 backdrop-blur-xl",
        "border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition hover:-translate-y-1 hover:shadow-xl",
      )}
    >
      {isFlagged && (
        <div className="absolute inset-x-0 top-0 z-10 bg-[linear-gradient(45deg,#FFB800,transparent_20%,#FFB800_40%,transparent_60%)] bg-[length:20px_20px] h-8 animate-pulse opacity-70" />
      )}
      <div className="p-4">
        <header className="flex items-center gap-3">
          <div className="relative">
            <Image
              src={avatar || "/placeholder.svg"}
              alt=""
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            {isNewPost && (post as PostWithAuthor).author?.verification_level === 'verified' && (
              <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-[#00D9A3] ring-2 ring-background animate-pulse" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <p className="truncate font-semibold text-foreground">{displayName}</p>
              {isVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{createdAt}</span>
              {location && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {location}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="ml-auto">
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#0066FF]/15 to-[#00BFFF]/15 px-2 py-1 text-xs text-primary ring-1 ring-[#00BFFF]/20">
              {category}
            </span>
          </div>
        </header>

        <div className="mt-3 text-sm leading-relaxed text-pretty text-foreground/90">{content}</div>

        {image && (
          <div className="mt-3 overflow-hidden rounded-xl">
            <Image
              src={image || "/placeholder.svg"}
              alt=""
              width={1200}
              height={800}
              className="h-auto w-full object-cover transition group-hover:scale-[1.02]"
            />
          </div>
        )}

        {aiSummary && (
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
                  {aiSummary}
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
            onClick={handleLike}
            disabled={!user}
            aria-pressed={liked}
          >
            <Heart className={cn("h-5 w-5", liked && "fill-[#FF3B5C]")} />
            <span>{likes}</span>
          </button>
          <button className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition active:scale-95">
            <MessageCircle className="h-5 w-5" />
            <span>{comments}</span>
          </button>
          <button className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition active:scale-95">
            <Share2 className="h-5 w-5" />
            <span>{isNewPost ? (post as PostWithAuthor).shares_count || 0 : 0}</span>
          </button>
        </footer>
      </div>
    </article>
  )
}

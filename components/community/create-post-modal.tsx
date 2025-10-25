"use client"

import * as React from "react"
import { X, Image, MapPin } from "lucide-react"
import { RippleButton } from "@/components/ui/ripple-button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

export function CreatePostModal({ open, onOpenChange, onPostCreated }: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onPostCreated?: () => void
}) {
  const { user } = useAuth()
  const [tab, setTab] = React.useState<"general" | "question" | "resource">("general")
  const [text, setText] = React.useState("")
  const [title, setTitle] = React.useState("")
  const [category, setCategory] = React.useState("general")
  const [location, setLocation] = React.useState("")
  const [isUrgent, setIsUrgent] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [imageUrl, setImageUrl] = React.useState("")

  if (!open) return null

  const submit = async () => {
    if (!user || !text.trim()) return

    setLoading(true)
    try {
      const postData = {
        title: title.trim() || text.slice(0, 100),
        content: text.trim(),
        category,
        location: location.trim() || undefined,
        is_urgent: isUrgent,
        image_url: imageUrl.trim() || undefined,
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      if (response.ok) {
        const { post } = await response.json()
        setText("")
        setTitle("")
        setLocation("")
        setImageUrl("")
        setIsUrgent(false)
        onOpenChange(false)
        onPostCreated?.()
      } else {
        const errorData = await response.json()
        console.error('Error creating post:', errorData.error)
        if (errorData.details && errorData.details.includes('schema.sql')) {
          alert(`Database setup required: ${errorData.details}`)
        } else {
          alert(`Error creating post: ${errorData.error}`)
        }
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setLoading(false)
    }
  }

  const isValid = text.trim().length >= 10 && text.trim().length <= 10000

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
          <div className="flex gap-2 mb-4">
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

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title (Optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief title for your post..."
                className="w-full px-3 py-2 border border-white/10 bg-transparent rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#00BFFF]/30"
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content *</label>
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Share your thoughts, ask questions, or provide resources..."
                  className="min-h-36 w-full resize-none rounded-lg border border-white/10 bg-transparent p-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-[#00BFFF]/30"
                  maxLength={10000}
                />
                <div className="pointer-events-none absolute bottom-2 right-3 text-xs text-muted-foreground">
                  {text.length}/10000
                </div>
              </div>
              {!isValid && text.length > 0 && (
                <p className="text-xs text-orange-500 mt-1">Content must be between 10 and 10,000 characters</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-white/10 bg-transparent rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#00BFFF]/30"
                >
                  <option value="general">General</option>
                  <option value="help">Help Request</option>
                  <option value="tip">Tips & Advice</option>
                  <option value="resource">Resources</option>
                  <option value="event">Events</option>
                  <option value="question">Questions</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Neighborhood"
                  className="w-full px-3 py-2 border border-white/10 bg-transparent rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#00BFFF]/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-white/10 bg-transparent rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#00BFFF]/30"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="rounded border-white/20 bg-transparent text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">Mark as Urgent</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
          <div className="text-xs text-muted-foreground">
            <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-1">AI Guardian Active</span>
          </div>
          <RippleButton onClick={submit} disabled={loading || !isValid}>
            {loading ? "Posting..." : "Submit Post"}
          </RippleButton>
        </div>
      </div>
    </div>
  )
}

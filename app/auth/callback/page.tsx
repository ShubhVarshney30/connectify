"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

export default function AuthCallbackPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          toast({
            title: "Authentication failed",
            description: error.message,
            variant: "destructive",
          })
          router.push("/auth")
          return
        }

        if (data.session) {
          toast({
            title: "Welcome back!",
            description: "You have been successfully signed in.",
          })
          router.push("/")
        } else {
          // No session, redirect back to auth
          router.push("/auth")
        }
      } catch (error) {
        console.error("Unexpected error:", error)
        toast({
          title: "Authentication failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
        router.push("/auth")
      } finally {
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [router, toast])

  // Show loading state while processing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Completing sign in...</p>
        </div>
      </div>
    )
  }

  return null
}

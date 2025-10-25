import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export { createClient }

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side Supabase client (for browser usage)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Server-side Supabase client for API routes
export const createServerSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`
      }
    }
  })
}

// Server-side Supabase client with service role (for admin operations)
export const createAdminSupabaseClient = () => {
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Helper function to get authenticated user in API routes
export const getAuthenticatedUser = async () => {
  try {
    // Only run in server-side contexts (API routes, server components)
    if (typeof window !== 'undefined') {
      return { user: null, error: new Error('getAuthenticatedUser can only be used in server-side code') }
    }

    const { cookies } = await import('next/headers')
    const cookieStore = cookies()
    const supabase = createServerSupabaseClient()

    // Try to get session from cookies
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session?.user) {
      return { user: null, error }
    }

    return { user: session.user, error: null }
  } catch (error) {
    console.error('Error getting authenticated user:', error)
    return { user: null, error }
  }
}

// Helper function to handle auth state changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback)
}

// Helper function to get current session
export const getSession = () => {
  return supabase.auth.getSession()
}

// Helper function to get current user
export const getUser = () => {
  return supabase.auth.getUser()
}

// Helper function to sign out
export const signOut = () => {
  return supabase.auth.signOut()
}

"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError, AuthApiError } from '@supabase/supabase-js'
import { supabase, onAuthStateChange, getSession, getUser, signOut } from '@/lib/supabase'
import type { Profile } from '@/types/database'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  error: AuthError | null
  signOut: () => Promise<{ error: AuthError | null }>
  refreshSession: () => Promise<{ error: AuthError | null }>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  // Load user profile when user changes
  const loadProfile = async (userId: string) => {
    try {
      console.log('AuthContext - Loading profile for userId:', userId)
      const response = await fetch(`/api/profile?userId=${userId}`)
      console.log('AuthContext - Profile API response status:', response.status)

      if (response.ok) {
        const { profile } = await response.json()
        console.log('AuthContext - Profile loaded successfully:', profile?.id)
        setProfile(profile)
      } else if (response.status === 404) {
        console.log('AuthContext - Profile not found, creating new profile')
        // Profile doesn't exist, create it
        const { data: { user } } = await getUser()
        if (user?.email) {
          await createProfile({
            userId,
            email: user.email,
            full_name: user.user_metadata?.full_name || null,
            avatar_url: user.user_metadata?.avatar_url || null,
          })
        }
      } else {
        const errorText = await response.text()
        console.error('AuthContext - Profile API error:', response.status, errorText)
        throw new Error(`Failed to load profile: ${response.status}`)
      }
    } catch (error) {
      console.error('AuthContext - Error loading profile:', error)
    }
  }

  const createProfile = async (profileData: {
    userId: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
  }) => {
    try {
      console.log('AuthContext - Creating profile for userId:', profileData.userId)
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      console.log('AuthContext - Create profile response status:', response.status)

      if (response.ok) {
        const { profile } = await response.json()
        console.log('AuthContext - Profile created successfully:', profile?.id)
        setProfile(profile)
        return profile
      } else {
        const errorText = await response.text()
        console.error('AuthContext - Create profile error:', response.status, errorText)
        throw new Error('Failed to create profile')
      }
    } catch (error) {
      console.error('AuthContext - Error creating profile:', error)
      return null
    }
  }

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        setError(null)
        const { data: { session }, error } = await getSession()

        if (error) {
          console.error('Error getting session:', error)
          setError(error)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
          if (session?.user) {
            await loadProfile(session.user.id)
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        setError(error as AuthError)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)

      setSession(session)
      setUser(session?.user ?? null)
      setError(null)
      setLoading(false)

      if (session?.user) {
        await loadProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    setLoading(true)
    try {
      const { error } = await signOut()
      if (error) {
        console.error('Error signing out:', error)
        setError(error)
      }
      return { error }
    } catch (error) {
      console.error('Unexpected error signing out:', error)
      const authError = error as AuthError
      setError(authError)
      return { error: authError }
    } finally {
      setLoading(false)
    }
  }

  const refreshSession = async () => {
    try {
      setError(null)
      const { error } = await supabase.auth.refreshSession()
      if (error) {
        console.error('Error refreshing session:', error)
        setError(error)
      }
      return { error }
    } catch (error) {
      console.error('Unexpected error refreshing session:', error)
      const authError = error as AuthError
      setError(authError)
      return { error: authError }
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: { message: 'No user logged in' } as AuthError }
    }

    try {
      setError(null)
      const response = await fetch(`/api/profile/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const { profile } = await response.json()
        setProfile(profile)
        return { error: null }
      } else {
        const errorData = await response.json()
        const error = { message: errorData.error || 'Failed to update profile' } as AuthError
        setError(error)
        return { error }
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      const authError = error as AuthError
      setError(authError)
      return { error: authError }
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    error,
    signOut: handleSignOut,
    refreshSession,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useUser() {
  const { user } = useAuth()
  return user
}

export function useProfile() {
  const { profile } = useAuth()
  return profile
}

export function useIsAuthenticated() {
  const { user } = useAuth()
  return !!user
}

export function useIsLoading() {
  const { loading } = useAuth()
  return loading
}

export function useRequireAuth() {
  const { user, loading, profile } = useAuth()

  if (loading) {
    return { user: null, profile: null, loading: true, isAuthenticated: false }
  }

  if (!user) {
    return { user: null, profile: null, loading: false, isAuthenticated: false }
  }

  return { user, profile, loading: false, isAuthenticated: true }
}

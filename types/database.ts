// Database types for Connect & Thrive Community Platform

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          location: string | null
          website: string | null
          phone: string | null
          date_of_birth: string | null
          is_verified: boolean
          verification_level: string
          points: number
          badges: Badge[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          phone?: string | null
          date_of_birth?: string | null
          is_verified?: boolean
          verification_level?: string
          points?: number
          badges?: Badge[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          phone?: string | null
          date_of_birth?: string | null
          is_verified?: boolean
          verification_level?: string
          points?: number
          badges?: Badge[]
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          author_id: string
          title: string
          content: string
          category: string
          tags: string[]
          image_url: string | null
          location: string | null
          is_urgent: boolean
          is_featured: boolean
          status: string
          likes_count: number
          comments_count: number
          shares_count: number
          views_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          content: string
          category?: string
          tags?: string[]
          image_url?: string | null
          location?: string | null
          is_urgent?: boolean
          is_featured?: boolean
          status?: string
          likes_count?: number
          comments_count?: number
          shares_count?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          title?: string
          content?: string
          category?: string
          tags?: string[]
          image_url?: string | null
          location?: string | null
          is_urgent?: boolean
          is_featured?: boolean
          status?: string
          likes_count?: number
          comments_count?: number
          shares_count?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          parent_id: string | null
          content: string
          likes_count: number
          is_flagged: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_id: string
          parent_id?: string | null
          content: string
          likes_count?: number
          is_flagged?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          author_id?: string
          parent_id?: string | null
          content?: string
          likes_count?: number
          is_flagged?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          post_id: string | null
          comment_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id?: string | null
          comment_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string | null
          comment_id?: string | null
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          post_id: string | null
          comment_id: string | null
          reason: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          post_id?: string | null
          comment_id?: string | null
          reason: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          post_id?: string | null
          comment_id?: string | null
          reason?: string
          status?: string
          created_at?: string
        }
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          category: string
          rarity: string
          points_required: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          category?: string
          rarity?: string
          points_required?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          category?: string
          rarity?: string
          points_required?: number
          created_at?: string
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          progress: number
          earned_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          progress?: number
          earned_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          progress?: number
          earned_at?: string | null
          created_at?: string
        }
      }
    }
  }
}

// Type helpers
import { createClient } from '@supabase/supabase-js'
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Like = Database['public']['Tables']['likes']['Row']
export type Report = Database['public']['Tables']['reports']['Row']
export type Badge = Database['public']['Tables']['badges']['Row']
export type UserBadge = Database['public']['Tables']['user_badges']['Row']

// Extended types with relations
export interface PostWithAuthor extends Post {
  author: Profile
  user_liked?: boolean
  comments?: CommentWithAuthor[]
}

export interface CommentWithAuthor extends Comment {
  author: Profile
  replies?: CommentWithAuthor[]
  user_liked?: boolean
}

export interface ProfileWithStats extends Profile {
  posts_count?: number
  comments_count?: number
  likes_received?: number
  badges_earned?: Badge[]
}

// Badge types (defined above in Database interface)

// Auth types
export interface AuthUser extends Profile {
  email: string
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  has_more: boolean
  next_cursor?: string
}

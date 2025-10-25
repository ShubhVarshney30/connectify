import { PrismaClient } from '@prisma/client'

// Initialize Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

import type { Prisma } from '@prisma/client'

export type Profile = Prisma.ProfileGetPayload<{}>
export type Post = Prisma.PostGetPayload<{}>
export type Comment = Prisma.CommentGetPayload<{}>
export type Like = Prisma.LikeGetPayload<{}>
export type Report = Prisma.ReportGetPayload<{}>
export type Badge = Prisma.BadgeGetPayload<{}>
export type UserBadge = Prisma.UserBadgeGetPayload<{}>

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

// Badge types
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary'
export type BadgeCategory = 'community' | 'volunteering' | 'safety' | 'education' | 'environment' | 'health' | 'general'

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

// Profile operations
export class ProfileService {
  static async getProfile(userId: string) {
    try {
      return await prisma.profile.findUnique({
        where: { id: userId }
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  static async createProfile(profile: {
    id: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    bio?: string | null
    location?: string | null
    website?: string | null
    phone?: string | null
    date_of_birth?: Date | null
    is_verified?: boolean
    verification_level?: string
    points?: number
    badges?: any
  }) {
    try {
      return await prisma.profile.create({
        data: profile
      })
    } catch (error) {
      console.error('Error creating profile:', error)
      return null
    }
  }

  static async updateProfile(userId: string, updates: {
    full_name?: string | null
    avatar_url?: string | null
    bio?: string | null
    location?: string | null
    website?: string | null
    phone?: string | null
    date_of_birth?: Date | null
    is_verified?: boolean
    verification_level?: string
    points?: number
    badges?: any
  }) {
    try {
      return await prisma.profile.update({
        where: { id: userId },
        data: updates
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      return null
    }
  }

  static async getAllProfilesWithPoints() {
    try {
      const profiles = await prisma.profile.findMany({
        include: {
          posts: {
            where: { status: 'active' },
            select: { id: true }
          },
          comments: {
            select: { id: true }
          },
          user_badges: {
            where: { earned_at: { not: null } },
            select: { badge: true }
          }
        },
        orderBy: {
          points: 'desc'
        }
      })

      return profiles.map((profile: any) => ({
        ...profile,
        posts_count: profile.posts.length,
        comments_count: profile.comments.length,
        badges_earned_count: profile.user_badges.length,
        badges_earned: profile.user_badges.map((ub: any) => ub.badge)
      }))
    } catch (error) {
      console.error('Error fetching profiles with points:', error)
      return []
    }
  }

  static async getProfileWithStats(userId: string): Promise<ProfileWithStats | null> {
    try {
      // Get profile with basic stats
      const profile = await prisma.profile.findUnique({
        where: { id: userId },
        include: {
          posts: {
            where: { status: 'active' },
            select: { id: true }
          },
          comments: {
            select: { id: true }
          },
          likes: {
            where: { post_id: { not: null } },
            select: { post: { select: { likes_count: true } } }
          }
        }
      })

      if (!profile) return null

      // Get earned badges
      const userBadges = await prisma.userBadge.findMany({
        where: {
          user_id: userId,
          earned_at: { not: null }
        },
        include: {
          badge: true
        }
      })

      const totalLikesReceived = profile.likes.reduce((sum: number, like: any) => sum + (like.post?.likes_count || 0), 0)

      return {
        ...profile,
        posts_count: profile.posts.length,
        comments_count: profile.comments.length,
        likes_received: totalLikesReceived,
        badges_earned: userBadges.map((ub: any) => ub.badge)
      } as ProfileWithStats
    } catch (error) {
      console.error('Error fetching profile with stats:', error)
      return null
    }
  }
}

// Post operations
export class PostService {
  static async getPosts(options?: {
    limit?: number
    offset?: number
    category?: string
    authorId?: string
    featured?: boolean
  }) {
    try {
      const where: any = {
        status: 'active'
      }

      if (options?.category) {
        where.category = options.category
      }

      if (options?.authorId) {
        where.author_id = options.authorId
      }

      if (options?.featured) {
        where.is_featured = true
      }

      return await prisma.post.findMany({
        where,
        include: {
          author: true
        },
        orderBy: {
          created_at: 'desc'
        },
        take: options?.limit,
        skip: options?.offset
      })
    } catch (error) {
      console.error('Error fetching posts:', error)
      return []
    }
  }

  static async getPost(postId: string): Promise<PostWithAuthor | null> {
    try {
      return await prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: true
        }
      }) as PostWithAuthor
    } catch (error) {
      console.error('Error fetching post:', error)
      return null
    }
  }

  static async createPost(post: {
    author_id: string
    title: string
    content: string
    category?: string
    tags?: string[]
    image_url?: string
    location?: string
    is_urgent?: boolean
    is_featured?: boolean
    status?: string
  }) {
    try {
      return await prisma.post.create({
        data: {
          ...post,
          status: post.status || 'active'
        }
      })
    } catch (error) {
      console.error('Error creating post:', error)
      return null
    }
  }

  static async updatePost(postId: string, updates: {
    title?: string
    content?: string
    category?: string
    tags?: string[]
    image_url?: string
    location?: string
    is_urgent?: boolean
    is_featured?: boolean
    status?: string
  }) {
    try {
      return await prisma.post.update({
        where: { id: postId },
        data: updates
      })
    } catch (error) {
      console.error('Error updating post:', error)
      return null
    }
  }

  static async deletePost(postId: string): Promise<boolean> {
    try {
      await prisma.post.delete({
        where: { id: postId }
      })
      return true
    } catch (error) {
      console.error('Error deleting post:', error)
      return false
    }
  }

  static async toggleLike(postId: string, userId: string): Promise<boolean> {
    try {
      // Check if like exists
      const existingLike = await prisma.like.findFirst({
        where: {
          user_id: userId,
          post_id: postId
        }
      })

      if (existingLike) {
        // Unlike - delete the like
        await prisma.like.delete({
          where: { id: existingLike.id }
        })
      } else {
        // Like - create new like
        await prisma.like.create({
          data: {
            user_id: userId,
            post_id: postId
          }
        })
      }

      return true
    } catch (error) {
      console.error('Error toggling like:', error)
      return false
    }
  }
}

// Comment operations
export class CommentService {
  static async getComments(postId: string): Promise<CommentWithAuthor[]> {
    try {
      const comments = await prisma.comment.findMany({
        where: {
          post_id: postId,
          parent_id: null
        },
        include: {
          author: true
        },
        orderBy: {
          created_at: 'asc'
        }
      })

      // Get replies for each comment
      const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
          const replies = await this.getReplies(comment.id)
          return { ...comment, replies } as CommentWithAuthor
        })
      )

      return commentsWithReplies
    } catch (error) {
      console.error('Error fetching comments:', error)
      return []
    }
  }

  static async getReplies(commentId: string): Promise<CommentWithAuthor[]> {
    try {
      return await prisma.comment.findMany({
        where: {
          parent_id: commentId
        },
        include: {
          author: true
        },
        orderBy: {
          created_at: 'asc'
        }
      }) as CommentWithAuthor[]
    } catch (error) {
      console.error('Error fetching replies:', error)
      return []
    }
  }

  static async createComment(comment: {
    post_id: string
    author_id: string
    parent_id?: string
    content: string
  }) {
    try {
      return await prisma.comment.create({
        data: comment
      })
    } catch (error) {
      console.error('Error creating comment:', error)
      return null
    }
  }

  static async toggleLike(commentId: string, userId: string): Promise<boolean> {
    try {
      // Check if like exists
      const existingLike = await prisma.like.findFirst({
        where: {
          user_id: userId,
          comment_id: commentId
        }
      })

      if (existingLike) {
        // Unlike - delete the like
        await prisma.like.delete({
          where: { id: existingLike.id }
        })
      } else {
        // Like - create new like
        await prisma.like.create({
          data: {
            user_id: userId,
            comment_id: commentId
          }
        })
      }

      return true
    } catch (error) {
      console.error('Error toggling comment like:', error)
      return false
    }
  }
}

// Badge operations
export class BadgeService {
  static async getAllBadges() {
    try {
      return await prisma.badge.findMany({
        orderBy: {
          points_required: 'asc'
        }
      })
    } catch (error) {
      console.error('Error fetching badges:', error)
      return []
    }
  }

  static async getUserBadges(userId: string) {
    try {
      return await prisma.userBadge.findMany({
        where: { user_id: userId },
        include: {
          badge: true
        }
      })
    } catch (error) {
      console.error('Error fetching user badges:', error)
      return []
    }
  }

  static async awardBadge(userId: string, badgeId: string): Promise<boolean> {
    try {
      // Check if user already has this badge and it's earned
      const existingBadge = await prisma.userBadge.findFirst({
        where: {
          user_id: userId,
          badge_id: badgeId,
          earned_at: { not: null }
        }
      })

      if (existingBadge) {
        // Badge already earned
        return true
      }

      // Check if user has this badge record (maybe in progress)
      const userBadgeRecord = await prisma.userBadge.findFirst({
        where: {
          user_id: userId,
          badge_id: badgeId
        }
      })

      if (userBadgeRecord) {
        // Update earned_at
        await prisma.userBadge.update({
          where: { id: userBadgeRecord.id },
          data: { earned_at: new Date() }
        })
      } else {
        // Create new user badge record
        await prisma.userBadge.create({
          data: {
            user_id: userId,
            badge_id: badgeId,
            earned_at: new Date()
          }
        })
      }

      return true
    } catch (error) {
      console.error('Error awarding badge:', error)
      return false
    }
  }
}

// Utility functions
export const incrementViews = async (postId: string): Promise<void> => {
  try {
    await prisma.post.update({
      where: { id: postId },
      data: {
        views_count: {
          increment: 1
        }
      }
    })
  } catch (error) {
    console.error('Error incrementing views:', error)
  }
}

export const searchPosts = async (query: string, limit = 20) => {
  try {
    return await prisma.post.findMany({
      where: {
        status: 'active',
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            content: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      include: {
        author: true
      },
      take: limit,
      orderBy: {
        created_at: 'desc'
      }
    })
  } catch (error) {
    console.error('Error searching posts:', error)
    return []
  }
}

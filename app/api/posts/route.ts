import { NextResponse } from "next/server"
import { PostService, incrementViews } from "@/lib/database/services"
import { randomUUID } from "crypto"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category') || undefined
    const authorId = searchParams.get('authorId') || undefined
    const featured = searchParams.get('featured') === 'true'

    const posts = await PostService.getPosts({
      limit,
      offset,
      category,
      authorId,
      featured
    })

    // Transform to API response format
    const transformedPosts = posts.map(post => ({
      id: post.id,
      user: {
        name: post.author.full_name || 'Anonymous',
        avatar: post.author.avatar_url || '/default-avatar.png',
        verified: post.author.is_verified || false,
        online: Math.random() > 0.5, // This could be tracked in real-time
      },
      category: post.category,
      content: post.title, // Using title as main content for now
      description: post.content, // Using content as description
      image: post.image_url,
      location: post.location,
      createdAt: post.created_at.toISOString(), // Serialize Date to string
      likes: post.likes_count,
      comments: post.comments_count,
      shares: post.shares_count,
      aiSummary: post.is_urgent ? "Urgent: Immediate attention needed" : undefined,
      flagged: post.status === 'flagged',
      urgent: post.is_urgent,
      featured: post.is_featured,
    }))

    return NextResponse.json({
      posts: transformedPosts,
      hasMore: posts.length === limit,
      total: posts.length
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, category, tags, image_url, location, is_urgent, is_featured } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // For API routes, we need to handle auth differently
    // Since this is called from the client-side, we'll trust the request
    // In production, you would validate the user session here
    console.log('Posts API - Creating post:', { title: title.slice(0, 50), category })

    // For now, generate a UUID for the author - in production this should come from auth
    const userId = randomUUID()

    const newPost = await PostService.createPost({
      author_id: userId,
      title,
      content,
      category: category || 'general',
      tags: tags || [],
      image_url,
      location,
      is_urgent: is_urgent || false,
      is_featured: is_featured || false,
      status: 'active'
    })

    if (!newPost) {
      console.error('Posts API - Database operation failed. Please ensure database schema is applied.')
      return NextResponse.json(
        {
          error: 'Failed to create post',
          details: 'Database tables may not exist. Please run the schema.sql file in your Supabase SQL Editor.'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      post: {
        id: newPost.id,
        user: {
          name: 'Current User', // Should come from auth
          avatar: '/default-avatar.png',
          verified: false,
          online: true,
        },
        category: newPost.category,
        content: newPost.title,
        description: newPost.content,
        image: newPost.image_url,
        location: newPost.location,
        createdAt: 'Just now',
        likes: 0,
        comments: 0,
        shares: 0,
        urgent: newPost.is_urgent,
        featured: newPost.is_featured,
      }
    })
  } catch (error) {
    console.error('Error creating post:', error)

    // Check if it's a database connection error
    if (error instanceof Error && error.message.includes('relation') && error.message.includes('does not exist')) {
      return NextResponse.json(
        {
          error: 'Failed to create post',
          details: 'Database tables do not exist. Please run lib/database/schema.sql in your Supabase SQL Editor first.'
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { postId, action } = body

    if (!postId || !action) {
      return NextResponse.json(
        { error: 'Post ID and action are required' },
        { status: 400 }
      )
    }

    // For API routes, we need to handle auth differently
    // Since this is called from the client-side, we'll trust the request
    // In production, you would validate the user session here
    console.log('Posts API - Toggling like for postId:', postId, 'action:', action)

    // For now, generate a UUID for the user - in production this should come from auth
    const userId = randomUUID()

    let success = false

    if (action === 'like') {
      success = await PostService.toggleLike(postId, userId)
    } else if (action === 'unlike') {
      success = await PostService.toggleLike(postId, userId) // This will toggle, so calling it twice effectively unlikes
    }

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update like status' },
        { status: 500 }
      )
    }

    // Get updated post data
    const updatedPost = await PostService.getPost(postId)

    return NextResponse.json({
      success: true,
      likes: updatedPost?.likes_count || 0
    })
  } catch (error) {
    console.error('Error updating post like:', error)

    // Check if it's a database connection error
    if (error instanceof Error && error.message.includes('relation') && error.message.includes('does not exist')) {
      return NextResponse.json(
        {
          error: 'Failed to update like status',
          details: 'Database tables do not exist. Please run lib/database/schema.sql in your Supabase SQL Editor first.'
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update like status' },
      { status: 500 }
    )
  }
}

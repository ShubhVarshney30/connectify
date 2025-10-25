import { NextResponse } from "next/server"
import { ProfileService } from "@/lib/database/services"
import { getAuthenticatedUser } from "@/lib/supabase"

// GET /api/profile - Get current user profile (query param)
// GET /api/profile/[userId] - Get specific user profile (dynamic route)
export async function GET(
  request: Request,
  { params }: { params?: { userId?: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = params?.userId || searchParams.get('userId')

    console.log('Profile API - Getting profile for userId:', userId)

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const profile = await ProfileService.getProfile(userId)

    if (!profile) {
      console.log('Profile API - Profile not found for userId:', userId)
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    console.log('Profile API - Found profile for userId:', userId)
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile API - Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// POST /api/profile - Create user profile
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, email, full_name, avatar_url } = body

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 }
      )
    }

    // For API routes, we need to handle auth differently
    // Since this is called from the client-side auth context,
    // we'll trust the userId provided and create the profile
    console.log('Profile API - Creating profile for userId:', userId)

    const newProfile = await ProfileService.createProfile({
      id: userId,
      email,
      full_name: full_name || null,
      avatar_url: avatar_url || null,
    })

    if (!newProfile) {
      console.error('Profile API - Failed to create profile in database')
      return NextResponse.json(
        { error: 'Failed to create profile in database' },
        { status: 500 }
      )
    }

    console.log('Profile API - Profile created successfully:', newProfile.id)
    return NextResponse.json({
      success: true,
      profile: newProfile
    })
  } catch (error) {
    console.error('Error creating profile:', error)
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    )
  }
}

// PATCH /api/profile/[userId] - Update user profile
export async function PATCH(
  request: Request,
  { params }: { params?: { userId?: string } }
) {
  try {
    const userId = params?.userId
    const body = await request.json()
    const updates = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // For API routes, we need to handle auth differently
    // Since this is called from the client-side auth context,
    // we'll trust the userId provided and update the profile
    console.log('Profile API - Updating profile for userId:', userId)

    const updatedProfile = await ProfileService.updateProfile(userId, updates)

    if (!updatedProfile) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    console.log('Profile API - Profile updated successfully:', updatedProfile.id)
    return NextResponse.json({
      success: true,
      profile: updatedProfile
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

import { NextResponse } from "next/server"
import { ProfileService } from "@/lib/database/services"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '30')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get all profiles sorted by points
    const profiles = await ProfileService.getAllProfilesWithPoints()

    // Transform to leaderboard format
    const leaderboard = profiles.slice(offset, offset + limit).map((profile: any, index: number) => ({
      rank: offset + index + 1,
      id: profile.id,
      name: profile.full_name || profile.email.split('@')[0] || 'Anonymous',
      avatar: profile.avatar_url || '/default-avatar.png',
      points: profile.points || 0,
      verified: profile.is_verified || false,
      badges: profile.badges_earned_count || 0,
      posts: profile.posts_count || 0,
      level: Math.floor((profile.points || 0) / 100) + 1, // Calculate level based on points
    }))

    return NextResponse.json({
      leaderboard,
      hasMore: profiles.length > offset + limit,
      total: profiles.length,
      userRank: profiles.length > 0 ? offset + 1 : null // Placeholder for current user rank
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}

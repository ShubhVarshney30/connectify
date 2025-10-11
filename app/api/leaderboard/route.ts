import { NextResponse } from "next/server"

const avatars = ["/avatar-a.jpg", "/avatar-b.jpg", "/avatar-c.jpg"]

export async function GET() {
  const data = Array.from({ length: 30 }).map((_, i) => ({
    rank: i + 1,
    name: `User ${i + 1}`,
    avatar: avatars[i % avatars.length],
    points: 5000 - i * 97,
  }))
  return NextResponse.json(data)
}

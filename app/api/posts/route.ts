import { NextResponse } from "next/server"

const avatars = ["/diverse-group-avatars.png", "/pandoran-bioluminescent-forest.png", "/diverse-group-avatars.png"]

const images = ["/community-help.jpg", "/first-aid-kit.png", "/hands-giving-donation.png"]

export async function GET() {
  const posts = Array.from({ length: 12 }).map((_, i) => ({
    id: `${i + 1}`,
    user: {
      name: ["Sam Carter", "Liu Wei", "Priya Patel", "Diego Alvarez"][i % 4],
      avatar: avatars[i % avatars.length],
      verified: i % 3 === 0,
      online: i % 2 === 0,
    },
    category: ["Help", "Tip", "Resource"][i % 3],
    content: ["Need volunteers near Oak St.", "Free CPR workshop this weekend!", "Sharing extra blankets & water."][
      i % 3
    ],
    image: i % 2 === 0 ? images[i % images.length] : undefined,
    createdAt: `${(i + 1) * 5} mins ago`,
    likes: 10 + i * 3,
    comments: 2 + i,
    shares: i,
    aiSummary: i % 2 === 0 ? "Summary: Local support request and availability of supplies." : undefined,
    flagged: i === 2,
  }))

  return NextResponse.json(posts)
}

import { NextResponse } from "next/server"

const avatars = [
  "/diverse-group-avatars.png",
  "/pandoran-bioluminescent-forest.png",
  "/diverse-group-avatars.png",
  "/volunteer-team-photo.jpg",
  "/community-garden-volunteers.png",
  "/emergency-response-team.jpg",
  "/youth-volunteers-group.png",
  "/medical-volunteers-team.jpg",
  "/disaster-relief-volunteers.png",
  "/environmental-volunteers-group.jpg",
  "/food-bank-volunteers.png",
  "/animal-shelter-volunteers.jpg"
]

const images = [
  "/community-help.jpg",
  "/first-aid-kit.png",
  "/hands-giving-donation.png",
  "/volunteer-cleanup-park.jpg",
  "/food-distribution-drive.png",
  "/medical-supplies-donation.jpg",
  "/emergency-shelter-setup.jpg",
  "/community-garden-planting.jpg",
  "/disaster-relief-supplies.jpg",
  "/youth-mentoring-program.jpg",
  "/animal-rescue-operation.jpg",
  "/environmental-cleanup-beach.jpg",
  "/homeless-shelter-meal.jpg",
  "/blood-donation-drive.jpg",
  "/senior-care-volunteering.jpg",
  "/school-supplies-drive.jpg",
  "/disaster-preparedness-training.jpg",
  "/community-art-project.jpg",
  "/refugee-support-services.jpg",
  "/mental-health-awareness.jpg"
]

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
    image: i < 10 ? images[i % images.length] : (i % 3 === 0 ? images[i % images.length] : undefined),
    createdAt: `${(i + 1) * 5} mins ago`,
    likes: 10 + i * 3,
    comments: 2 + i,
    shares: i,
    aiSummary: i % 2 === 0 ? "Summary: Local support request and availability of supplies." : undefined,
    flagged: i === 2,
  }))

  return NextResponse.json(posts)
}

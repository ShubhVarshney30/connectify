import { NextResponse } from "next/server"

const resourceImages = [
  // Medical resources
  "/first-aid-kit.png",
  "/medical-supplies-donation.jpg",
  "/blood-donation-drive.jpg",
  "/emergency-response-team.jpg",
  
  // Transport resources
  "/community-help.jpg",
  "/volunteer-cleanup-park.jpg",
  "/food-distribution-drive.png",
  
  // Learning resources
  "/youth-mentoring-program.jpg",
  "/disaster-preparedness-training.jpg",
  "/school-supplies-drive.jpg",
  "/community-art-project.jpg",
  
  // Hardware/Tools resources
  "/disaster-relief-supplies.jpg",
  "/emergency-shelter-setup.jpg",
  "/volunteer-team-photo.jpg",
  "/hands-giving-donation.png"
]

export async function GET() {
  const data = Array.from({ length: 15 }).map((_, i) => ({
    id: `${i}`,
    title: ["First Aid Kit", "Carpool Ride", "Coding Mentorship", "Tool Set"][i % 4],
    image: resourceImages[i % resourceImages.length],
    distance: `${(i % 7) + 1} km`,
    category: ["Medical", "Transport", "Learning", "Hardware"][i % 4],
    score: 40 + ((i * 7) % 60),
  }))
  return NextResponse.json(data)
}

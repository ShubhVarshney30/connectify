import { NextResponse } from "next/server"

export async function GET() {
  const data = Array.from({ length: 15 }).map((_, i) => ({
    id: `${i}`,
    title: ["First Aid Kit", "Carpool Ride", "Coding Mentorship", "Tool Set"][i % 4],
    image: `/placeholder.svg?height=${300 + (i % 3) * 80}&width=1200&query=resource-${i}`,
    distance: `${(i % 7) + 1} km`,
    category: ["Medical", "Transport", "Learning", "Hardware"][i % 4],
    score: 40 + ((i * 7) % 60),
  }))
  return NextResponse.json(data)
}

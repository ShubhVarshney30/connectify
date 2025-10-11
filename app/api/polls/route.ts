import { NextResponse } from "next/server"

export async function GET() {
  const data = Array.from({ length: 6 }).map((_, i) => ({
    id: `p${i}`,
    question: ["Best emergency kit item?", "Preferred meetup time?", "Top resource need?"][i % 3],
    options: [
      { id: "a", label: ["Water", "Morning", "Medical"][i % 3], votes: 50 + i * 3 },
      { id: "b", label: ["First Aid", "Afternoon", "Transport"][i % 3], votes: 30 + i * 2 },
      { id: "c", label: ["Flashlight", "Evening", "Food"][i % 3], votes: 20 + i },
    ],
    total: 100 + i * 10,
    endsIn: `${2 + i}h`,
  }))
  return NextResponse.json(data)
}

import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    active: [
      { id: "a1", location: "Main St & 3rd", urgency: "HIGH", minutes: 2 },
      { id: "a2", location: "Riverside Park", urgency: "MEDIUM", minutes: 8 },
    ],
    resolved: [
      { id: "r1", location: "Pine Ave", minutes: 25 },
      { id: "r2", location: "Elm St", minutes: 40 },
    ],
  })
}

export async function POST() {
  // pretend we created an alert
  return NextResponse.json({ ok: true, id: "new" }, { status: 201 })
}

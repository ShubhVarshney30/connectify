import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    members: 2487,
    resources: 731,
    responseMs: 4200,
  })
}

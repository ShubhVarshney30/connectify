import { NextResponse } from "next/server"
import { generateText } from "ai"

// Note: Next.js handles the AI Gateway configuration.
// Using OpenAI mini by default; can be changed per user request.

type Msg = { role: "user" | "assistant"; content: string }

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: Msg[] }
  const prompt =
    messages.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n") + "\nAssistant:"
  const { text } = await generateText({
    model: "openai/gpt-5-mini",
    prompt: `You are an AI helper for a community platform. Keep replies concise and helpful.\n\n${prompt}`,
  })
  return NextResponse.json({ reply: text })
}

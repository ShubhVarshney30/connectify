import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Using Google's Gemini 2.5-flash model for the AI chatbot

type Msg = { role: "user" | "assistant"; content: string }

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages: Msg[] }

    // Check if API key is configured
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY not configured")
      return NextResponse.json({
        reply: "I'm currently unavailable. Please configure the Gemini API key to enable AI chat functionality."
      })
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const prompt =
      messages.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n") + "\nAssistant:"

    const fullPrompt = `You are an AI helper for a community platform called Connect & Thrive. You help users with community-related questions, volunteer opportunities, and general assistance. Keep replies concise, helpful, and engaging.

${prompt}`

    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ reply: text })
  } catch (error) {
    console.error("Chat API error:", error)

    // Fallback response if AI service fails
    return NextResponse.json({
      reply: "I'm having trouble connecting right now. Please try again in a moment, or contact support if the issue persists."
    })
  }
}

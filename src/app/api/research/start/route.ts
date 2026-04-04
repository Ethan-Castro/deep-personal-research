import { NextResponse } from "next/server"
import { StartResearchSchema, type SessionState } from "@/lib/types"
import { createSession } from "@/lib/sessionStore"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = StartResearchSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { userProfile, researchType } = parsed.data

    // Generate session ID
    const sessionId = `pi_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    const session: SessionState = {
      id: sessionId,
      userProfile,
      researchType,
      status: "pending",
      findings: [],
      insights: [],
      createdAt: Date.now(),
    }

    createSession(session)

    return NextResponse.json({ sessionId })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to start research", message: String(err) },
      { status: 500 }
    )
  }
}

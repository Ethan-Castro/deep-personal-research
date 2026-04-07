import { NextResponse } from "next/server"
import { getModel } from "@/lib/models"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"

export async function POST(request: Request) {
  try {
    const { rfpText } = await request.json()

    if (!rfpText || typeof rfpText !== "string" || rfpText.trim().length < 5) {
      return NextResponse.json(
        { error: "Please provide a research question or RFP (at least 5 characters)." },
        { status: 400 },
      )
    }

    const model = getModel("briefGenerator")

    const response = await model.invoke([
      new SystemMessage(
        `You are a research planning assistant. Given a research request (RFP), generate exactly 5 distinct research directions. Each should be a focused, actionable angle that a team of AI research agents could investigate using academic databases (PubMed), labor/occupation data (O*NET), and web sources (Exa).

Return ONLY valid JSON with no markdown formatting:
{"directions":[{"title":"...","description":"..."},{"title":"...","description":"..."},{"title":"...","description":"..."},{"title":"...","description":"..."},{"title":"...","description":"..."}]}`
      ),
      new HumanMessage(`Research Request:\n${rfpText.trim()}`),
    ])

    const text = typeof response.content === "string" ? response.content : ""
    const jsonMatch = text.match(/\{[\s\S]*\}/)

    let directions: { title: string; description: string }[] = []
    try {
      const parsed = JSON.parse(jsonMatch?.[0] ?? "{}")
      directions = parsed.directions ?? []
    } catch {
      directions = [
        { title: "General Investigation", description: rfpText.trim().slice(0, 120) },
      ]
    }

    // Ensure exactly 5 and add ids
    const result = directions.slice(0, 5).map((d, i) => ({
      id: `dir_${i}`,
      title: d.title,
      description: d.description,
    }))

    return NextResponse.json({ directions: result })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to generate research directions", message: String(err) },
      { status: 500 },
    )
  }
}

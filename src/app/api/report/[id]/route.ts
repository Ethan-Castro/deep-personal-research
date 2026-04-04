import { NextResponse } from "next/server"
import { getSession } from "@/lib/sessionStore"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // The report ID format is `report_{sessionId}`
  const sessionId = id.replace("report_", "")
  const session = getSession(sessionId)

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  }

  if (!session.report) {
    return NextResponse.json(
      { error: "Report not yet available", status: session.status },
      { status: 202 }
    )
  }

  return NextResponse.json(session.report)
}

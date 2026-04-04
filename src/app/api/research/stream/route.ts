import { getSession, updateSession } from "@/lib/sessionStore"
import { runResearchPipeline } from "@/agents/pipeline"
import type { AgentEvent } from "@/lib/events"

export const maxDuration = 300

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("sessionId")

  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Missing sessionId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const session = getSession(sessionId)
  if (!session) {
    return new Response(JSON.stringify({ error: "Session not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: AgentEvent) => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
          )
        } catch {
          // Stream may have been closed by client disconnect
        }
      }

      // Set up timeout warning
      const startTime = Date.now()
      const maxRuntime = 270_000 // 4.5 min — leave 30s buffer for Vercel's 5 min limit
      const timeoutCheck = setInterval(() => {
        if (Date.now() - startTime > maxRuntime) {
          emit({
            type: "timeout_warning",
            agentId: "system",
            timestamp: Date.now(),
            data: {
              elapsedMs: Date.now() - startTime,
              synthesizingEarly: true,
            },
          })
        }
      }, 30_000)

      try {
        updateSession(sessionId, { status: "running" })

        const report = await runResearchPipeline(session, emit)

        updateSession(sessionId, {
          status: "complete",
          report,
        })
      } catch (err) {
        emit({
          type: "error",
          agentId: "system",
          timestamp: Date.now(),
          data: { message: err instanceof Error ? err.message : String(err) },
        })

        updateSession(sessionId, { status: "error" })
      } finally {
        clearInterval(timeoutCheck)
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

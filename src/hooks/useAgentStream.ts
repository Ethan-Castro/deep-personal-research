"use client"

import { useEffect, useRef, useCallback } from "react"
import { useResearchState } from "./useResearchState"
import type { AgentEvent } from "@/lib/events"
import type { Finding, Insight, ReportSection, WorkoutPlan, CareerGuide } from "@/lib/types"

let nodeCounter = 0

function nextNodeId(prefix: string) {
  return `${prefix}_${++nodeCounter}`
}

export function useAgentStream(sessionId: string | null) {
  const eventSourceRef = useRef<EventSource | null>(null)
  const store = useResearchState()

  const processEvent = useCallback(
    (event: AgentEvent) => {
      store.addActivity(event)

      switch (event.type) {
        case "session_started":
          store.setStatus("briefing")
          // Add center node
          store.addNode({
            id: "center",
            type: "center",
            position: { x: 0, y: 0 },
            data: {
              label: "Personal PI",
              status: "active",
              researchType: event.data.researchType,
            },
          })
          break

        case "brief_generated":
          store.setStatus("researching")
          break

        case "agent_spawned": {
          const agentId = event.agentId
          const parentId = event.parentId ?? "center"

          store.addNode({
            id: agentId,
            type: "agent",
            position: { x: 0, y: 0 },
            data: {
              label: event.data.name,
              role: event.data.role,
              team: event.data.team,
              status: "running",
              thought: "",
              description: event.data.description,
            },
          })

          store.addEdge({
            id: `e_${parentId}_${agentId}`,
            source: parentId,
            target: agentId,
            type: "dataFlow",
            data: { edgeType: "request" },
            animated: true,
          })
          break
        }

        case "agent_thinking":
          store.updateNode(event.agentId, {
            thought: event.data.thought,
            step: event.data.step,
          })
          break

        case "agent_tool_call": {
          const sourceId = nextNodeId("source")
          store.addNode({
            id: sourceId,
            type: "source",
            position: { x: 0, y: 0 },
            data: {
              toolName: event.data.toolName,
              query: String(event.data.toolInput).slice(0, 100),
              preview: String(event.data.toolOutputPreview).slice(0, 100),
            },
          })
          store.addEdge({
            id: `e_${event.agentId}_${sourceId}`,
            source: event.agentId,
            target: sourceId,
            type: "dataFlow",
            data: { edgeType: "request" },
          })
          break
        }

        case "agent_finding": {
          const finding = event.data.finding as Finding
          store.addFinding(finding)

          const findingNodeId = `finding_${finding.id}`
          store.addNode({
            id: findingNodeId,
            type: "finding",
            position: { x: 0, y: 0 },
            data: {
              title: finding.title,
              evidenceGrade: finding.evidenceGrade,
              sourceType: finding.sourceType,
              summary: finding.summary,
            },
          })
          store.addEdge({
            id: `e_${event.agentId}_${findingNodeId}`,
            source: event.agentId,
            target: findingNodeId,
            type: "dataFlow",
            data: { edgeType: "finding" },
          })
          break
        }

        case "agent_complete":
          store.updateNode(event.agentId, { status: "complete" })
          if (event.agentId === "evidence_grader") {
            store.setStatus("synthesizing")
          }
          break

        case "agent_error":
          store.updateNode(event.agentId, { status: "error" })
          break

        case "insight_synthesized": {
          const insight = event.data.insight as Insight
          store.addInsight(insight)

          const insightNodeId = `insight_${insight.id}`
          store.addNode({
            id: insightNodeId,
            type: "insight",
            position: { x: 0, y: 0 },
            data: {
              title: insight.title,
              content: insight.content,
              evidenceGrade: insight.evidenceGrade,
              domain: insight.domain,
            },
          })

          // Connect to supporting findings
          for (const findingId of insight.supportingFindings) {
            const findingNodeId = `finding_${findingId}`
            store.addEdge({
              id: `e_${findingNodeId}_${insightNodeId}`,
              source: findingNodeId,
              target: insightNodeId,
              type: "dataFlow",
              data: { edgeType: "synthesis" },
            })
          }
          break
        }

        case "report_section": {
          const section = event.data.section as ReportSection
          store.addReportSection(section)
          store.setStatus("writing")
          break
        }

        case "workout_plan_generated": {
          const plan = event.data.workoutPlan as WorkoutPlan
          store.setWorkoutPlan(plan)
          break
        }

        case "career_guide_generated": {
          const guide = event.data.careerGuide as CareerGuide
          store.setCareerGuide(guide)
          break
        }

        case "research_complete":
          store.setStatus("complete")
          if (event.data.reportId) {
            store.setReportId(event.data.reportId as string)
          }
          break

        case "timeout_warning":
          // Could show a toast/banner
          break

        case "error":
          store.setStatus("error")
          break
      }
    },
    [store]
  )

  useEffect(() => {
    if (!sessionId) return

    store.setSessionId(sessionId)
    store.setStatus("connecting")
    nodeCounter = 0

    const es = new EventSource(`/api/research/stream?sessionId=${sessionId}`)
    eventSourceRef.current = es

    es.onmessage = (e) => {
      try {
        const event: AgentEvent = JSON.parse(e.data)
        processEvent(event)
      } catch {
        // Skip unparseable events
      }
    }

    es.onerror = () => {
      if (es.readyState === EventSource.CLOSED) {
        // Stream ended normally
      } else {
        store.setStatus("error")
      }
    }

    return () => {
      es.close()
      eventSourceRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])
}

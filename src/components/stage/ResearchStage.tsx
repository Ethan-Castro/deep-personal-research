"use client"

import { useMemo } from "react"
import { useResearchState } from "@/hooks/useResearchState"
import { TeamColumn } from "./TeamColumn"
import { OrchestratorArea } from "./OrchestratorArea"
import { ConnectionsOverlay } from "./ConnectionsOverlay"
import { BackgroundEffect } from "./BackgroundEffect"

export function ResearchStage() {
  const nodes = useResearchState((s) => s.nodes)

  const { orchestratorId, domainTeam, synthesisTeam, domainLabel, domainColor } =
    useMemo(() => {
      const agentNodes = nodes.filter((n) => n.type === "agent")

      let orch: string | null = null
      const domain: string[] = []
      const synthesis: string[] = []
      let label = "Domain"
      let color = "#6b7280"

      for (const node of agentNodes) {
        const team = node.data?.team as string | undefined
        if (team === "orchestrator") {
          orch = node.id
        } else if (team === "health") {
          domain.push(node.id)
          label = "Health"
          color = "#10b981"
        } else if (team === "career") {
          domain.push(node.id)
          label = "Career"
          color = "#3b82f6"
        } else if (team === "synthesis") {
          synthesis.push(node.id)
        }
      }

      return {
        orchestratorId: orch,
        domainTeam: domain,
        synthesisTeam: synthesis,
        domainLabel: label,
        domainColor: color,
      }
    }, [nodes])

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden">
      <BackgroundEffect />

      <ConnectionsOverlay />

      <div className="relative z-10 flex items-start justify-center gap-12 px-8">
        {/* Domain team (left) */}
        <TeamColumn
          label={domainLabel}
          agentIds={domainTeam}
          color={domainColor}
        />

        {/* Orchestrator (center) */}
        <OrchestratorArea agentId={orchestratorId} />

        {/* Synthesis team (right) */}
        <TeamColumn
          label="Synthesis"
          agentIds={synthesisTeam}
          color="#f59e0b"
        />
      </div>
    </div>
  )
}

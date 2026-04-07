"use client"

import { useMemo } from "react"
import { useResearchState } from "@/hooks/useResearchState"
import { TeamColumn } from "./TeamColumn"
import { OrchestratorArea } from "./OrchestratorArea"
import { ConnectionsOverlay } from "./ConnectionsOverlay"
import { BackgroundEffect } from "./BackgroundEffect"

const TEAM_META: Record<string, { label: string; color: string }> = {
  health: { label: "Health", color: "#10b981" },
  career: { label: "Career", color: "#3b82f6" },
  finance: { label: "Finance", color: "#ec4899" },
  social: { label: "Social", color: "#06b6d4" },
}

export function ResearchStage() {
  const nodes = useResearchState((s) => s.nodes)

  const { orchestratorIds, domainTeams, synthesisTeam, isLabMode, domainLabel, domainColor } =
    useMemo(() => {
      const agentNodes = nodes.filter((n) => n.type === "agent")

      const orch: string[] = []
      const teams: Record<string, string[]> = {}
      const synthesis: string[] = []

      for (const node of agentNodes) {
        const team = node.data?.team as string | undefined
        if (team === "orchestrator") {
          orch.push(node.id)
        } else if (team === "synthesis") {
          synthesis.push(node.id)
        } else if (team) {
          if (!teams[team]) teams[team] = []
          teams[team].push(node.id)
        }
      }

      const domainTeamNames = Object.keys(teams)
      const labMode = domainTeamNames.length > 2

      // For non-lab mode, compute single domain label/color
      let label = "Domain"
      let color = "#6b7280"
      if (!labMode) {
        for (const name of domainTeamNames) {
          if (TEAM_META[name]) {
            label = TEAM_META[name].label
            color = TEAM_META[name].color
          }
        }
      }

      return {
        orchestratorIds: orch,
        domainTeams: teams,
        synthesisTeam: synthesis,
        isLabMode: labMode,
        domainLabel: label,
        domainColor: color,
      }
    }, [nodes])

  if (isLabMode) {
    // LAB layout: 3×2 grid
    return (
      <div className="relative flex h-full items-center justify-center overflow-hidden">
        <BackgroundEffect />
        <ConnectionsOverlay />

        <div className="relative z-10 grid grid-cols-3 gap-6 px-6" style={{ maxWidth: 1200 }}>
          {/* Row 1: Health | Orchestrator | Career */}
          <TeamColumn
            label={TEAM_META.health?.label ?? "Health"}
            agentIds={domainTeams.health ?? []}
            color={TEAM_META.health?.color ?? "#10b981"}
            compact
          />
          <OrchestratorArea agentIds={orchestratorIds} />
          <TeamColumn
            label={TEAM_META.career?.label ?? "Career"}
            agentIds={domainTeams.career ?? []}
            color={TEAM_META.career?.color ?? "#3b82f6"}
            compact
          />

          {/* Row 2: Finance | Synthesis | Social */}
          <TeamColumn
            label={TEAM_META.finance?.label ?? "Finance"}
            agentIds={domainTeams.finance ?? []}
            color={TEAM_META.finance?.color ?? "#ec4899"}
            compact
          />
          <TeamColumn
            label="Synthesis"
            agentIds={synthesisTeam}
            color="#f59e0b"
            compact
          />
          <TeamColumn
            label={TEAM_META.social?.label ?? "Social"}
            agentIds={domainTeams.social ?? []}
            color={TEAM_META.social?.color ?? "#06b6d4"}
            compact
          />
        </div>
      </div>
    )
  }

  // Original 3-column layout for health/career scenarios
  const allDomain = Object.values(domainTeams).flat()

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden">
      <BackgroundEffect />
      <ConnectionsOverlay />

      <div className="relative z-10 flex items-start justify-center gap-12 px-8">
        {/* Domain team (left) */}
        <TeamColumn
          label={domainLabel}
          agentIds={allDomain}
          color={domainColor}
        />

        {/* Orchestrator (center) */}
        <OrchestratorArea agentId={orchestratorIds[0] ?? null} />

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

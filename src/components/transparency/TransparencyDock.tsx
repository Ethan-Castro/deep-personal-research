"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { useResearchState } from "@/hooks/useResearchState"
import { getAgentConfig } from "@/components/avatar/agentConfig"
import { ActivityFeed } from "./ActivityFeed"
import { ToolCallCard } from "./ToolCallCard"
import { FindingCard } from "./FindingCard"
import type { Finding } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"

export function TransparencyDock() {
  const selectedNodeId = useResearchState((s) => s.selectedNodeId)
  const activityLog = useResearchState((s) => s.activityLog)
  const findings = useResearchState((s) => s.findings)

  const filteredEvents = useMemo(() => {
    if (!selectedNodeId) return activityLog.slice(-40)
    return activityLog.filter((e) => e.agentId === selectedNodeId)
  }, [selectedNodeId, activityLog])

  const agentFindings = useMemo(() => {
    if (!selectedNodeId) return []
    return findings.filter((f) => f.agentId === selectedNodeId)
  }, [selectedNodeId, findings])

  const config = selectedNodeId ? getAgentConfig(selectedNodeId) : null

  return (
    <motion.div
      className="border-t border-border bg-card/50 backdrop-blur-sm"
      style={{ height: 180 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border/50 px-3 py-1.5">
        {config ? (
          <>
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: config.teamColor }}
            />
            <span className="text-[10px] font-semibold text-foreground">
              {config.displayName}
            </span>
            <span className="text-[9px] text-muted-foreground">
              — {filteredEvents.length} events
              {agentFindings.length > 0 &&
                ` · ${agentFindings.length} findings`}
            </span>
          </>
        ) : (
          <>
            <div className="h-2 w-2 rounded-full bg-foreground/30" />
            <span className="text-[10px] font-semibold text-foreground">
              Global Activity
            </span>
            <span className="text-[9px] text-muted-foreground">
              — Click an agent to focus
            </span>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex h-[calc(100%-28px)]">
        {/* Activity feed (main area) */}
        <div className="flex-1 min-w-0">
          <ActivityFeed events={filteredEvents} />
        </div>

        {/* Agent findings sidebar (when agent selected) */}
        {selectedNodeId && agentFindings.length > 0 && (
          <div className="w-48 border-l border-border/50">
            <div className="px-2 py-1.5">
              <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                Findings
              </span>
            </div>
            <ScrollArea className="h-[calc(100%-24px)]">
              <div className="space-y-1 px-2 pb-2">
                {agentFindings.map((f) => (
                  <FindingCard
                    key={f.id}
                    title={f.title}
                    evidenceGrade={f.evidenceGrade}
                    sourceType={f.sourceType}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </motion.div>
  )
}

"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brain,
  Search,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  Play,
} from "lucide-react"
import type { AgentEvent } from "@/lib/events"
import { getAgentConfig } from "@/components/avatar/agentConfig"

interface ActivityFeedProps {
  events: AgentEvent[]
}

const eventIcons: Record<string, typeof Brain> = {
  agent_spawned: Play,
  agent_thinking: Brain,
  agent_tool_call: Search,
  agent_finding: Lightbulb,
  agent_complete: CheckCircle2,
  agent_error: AlertCircle,
  insight_synthesized: Sparkles,
  report_section: FileText,
}

function eventLabel(event: AgentEvent): string {
  const data = event.data
  switch (event.type) {
    case "session_started":
      return "Research session started"
    case "brief_generated":
      return "Research brief generated"
    case "agent_spawned":
      return `${(data.name as string) || event.agentId} spawned`
    case "agent_thinking":
      return (data.thought as string) || "Thinking..."
    case "agent_tool_call":
      return `${data.toolName}: ${String(data.toolInput).slice(0, 80)}`
    case "agent_finding":
      return `Found: ${((data.finding as Record<string, unknown>)?.title as string) || "new finding"}`
    case "agent_complete":
      return `${event.agentId} completed (${data.findingsCount ?? 0} findings)`
    case "agent_error":
      return `Error: ${(data.error as string) || "unknown"}`
    case "insight_synthesized":
      return `Insight: ${((data.insight as Record<string, unknown>)?.title as string) || "new insight"}`
    case "report_section":
      return `Writing: ${((data.section as Record<string, unknown>)?.sectionName as string) || "section"}`
    case "research_complete":
      return "Research complete!"
    default:
      return event.type
  }
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [events.length])

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto px-3 py-2 space-y-1">
      <AnimatePresence initial={false}>
        {events.map((event, i) => {
          const Icon = eventIcons[event.type] ?? Brain
          const config = getAgentConfig(event.agentId)
          const label = eventLabel(event)

          return (
            <motion.div
              key={`${event.type}-${event.agentId}-${i}`}
              className="flex items-start gap-2 py-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="mt-0.5 shrink-0 rounded-full p-0.5"
                style={{ backgroundColor: `${config.teamColor}15` }}
              >
                <Icon
                  className="h-3 w-3"
                  style={{ color: config.teamColor }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[9px] font-semibold"
                    style={{ color: config.teamColor }}
                  >
                    {config.displayName}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
                  {label}
                </p>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {events.length === 0 && (
        <p className="text-center text-[10px] text-muted-foreground/50 py-4">
          Waiting for agent activity...
        </p>
      )}
    </div>
  )
}

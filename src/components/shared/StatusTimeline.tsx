"use client"

import { useResearchState } from "@/hooks/useResearchState"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useRef } from "react"

const eventLabels: Record<string, (data: Record<string, unknown>) => string> = {
  session_started: () => "Research session started",
  brief_generated: (d) => `Research brief generated: ${(d.researchQuestions as string[])?.length ?? 0} questions`,
  agent_spawned: (d) => `Agent spawned: ${d.name}`,
  agent_thinking: (d) => String(d.thought ?? "Thinking..."),
  agent_tool_call: (d) => `Calling ${d.toolName}...`,
  agent_finding: (d) => {
    const f = d.finding as { title?: string } | undefined
    return `Finding: ${f?.title ?? "New finding"}`
  },
  agent_complete: (d) => `Agent complete — ${d.findingsCount ?? 0} findings`,
  agent_error: (d) => `Error: ${d.error ?? "Unknown error"}`,
  insight_synthesized: (d) => {
    const ins = d.insight as { title?: string } | undefined
    return `Insight: ${ins?.title ?? "New insight"}`
  },
  report_section: (d) => {
    const sec = d.section as { sectionName?: string } | undefined
    return `Report: ${sec?.sectionName ?? "New section"}`
  },
  research_complete: () => "Research complete!",
  timeout_warning: () => "Approaching time limit — synthesizing early...",
  error: (d) => `Error: ${d.message ?? "Unknown"}`,
}

export function StatusTimeline() {
  const activityLog = useResearchState((s) => s.activityLog)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [activityLog.length])

  if (activityLog.length === 0) return null

  return (
    <div className="rounded-lg border border-border bg-card/80 backdrop-blur-sm">
      <div className="border-b border-border px-3 py-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Activity
        </span>
      </div>
      <ScrollArea className="h-32" ref={scrollRef}>
        <div className="space-y-0.5 p-2">
          {activityLog.slice(-30).map((event, i) => {
            const labelFn = eventLabels[event.type]
            const label = labelFn
              ? labelFn(event.data)
              : event.type

            return (
              <div key={i} className="flex items-start gap-2 text-[11px]">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                <span className="text-muted-foreground leading-tight truncate">
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

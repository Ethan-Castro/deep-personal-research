"use client"

import Lottie from "lottie-react"
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
import type { AgentEventType } from "@/lib/events"

import iconBrain from "../../../public/lottie/icon-brain.json"
import iconSearch from "../../../public/lottie/icon-search.json"
import iconLightbulb from "../../../public/lottie/icon-lightbulb.json"
import iconCheck from "../../../public/lottie/icon-check.json"
import iconError from "../../../public/lottie/icon-error.json"

const lottieMap: Partial<Record<AgentEventType, object>> = {
  agent_thinking: iconBrain,
  agent_tool_call: iconSearch,
  agent_finding: iconLightbulb,
  agent_complete: iconCheck,
  agent_error: iconError,
}

const lucideMap: Partial<Record<AgentEventType, typeof Brain>> = {
  agent_spawned: Play,
  agent_thinking: Brain,
  agent_tool_call: Search,
  agent_finding: Lightbulb,
  agent_complete: CheckCircle2,
  agent_error: AlertCircle,
  insight_synthesized: Sparkles,
  report_section: FileText,
}

interface LottieEventIconProps {
  eventType: AgentEventType
  color: string
  isNew: boolean
}

export function LottieEventIcon({ eventType, color, isNew }: LottieEventIconProps) {
  const lottieData = lottieMap[eventType]

  // Only animate Lottie for events < 2s old and that have a mapped animation
  if (isNew && lottieData) {
    return (
      <div style={{ width: 14, height: 14 }}>
        <Lottie
          animationData={lottieData}
          loop={false}
          autoplay
          style={{ width: 14, height: 14 }}
        />
      </div>
    )
  }

  // Fall back to Lucide for older events or unmapped types
  const Icon = lucideMap[eventType] ?? Brain
  return <Icon className="h-3 w-3" style={{ color }} />
}

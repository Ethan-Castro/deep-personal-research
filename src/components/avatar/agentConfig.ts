import {
  Crown,
  FileText,
  Dna,
  Hammer,
  Briefcase,
  TrendingUp,
  Route,
  Scale,
  Sparkles,
  PenTool,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface AgentPersonality {
  displayName: string
  icon: LucideIcon
  teamColor: string      // hex for SVG fills
  teamColorClass: string  // tailwind color token
  team: "orchestrator" | "health" | "career" | "synthesis"
}

export const AGENT_CONFIG: Record<string, AgentPersonality> = {
  supervisor: {
    displayName: "Supervisor",
    icon: Crown,
    teamColor: "#a855f7",
    teamColorClass: "purple",
    team: "orchestrator",
  },
  pubmed_researcher: {
    displayName: "PubMed Researcher",
    icon: FileText,
    teamColor: "#10b981",
    teamColorClass: "emerald",
    team: "health",
  },
  genetics_analyst: {
    displayName: "Genetics Analyst",
    icon: Dna,
    teamColor: "#10b981",
    teamColorClass: "emerald",
    team: "health",
  },
  protocol_builder: {
    displayName: "Protocol Builder",
    icon: Hammer,
    teamColor: "#10b981",
    teamColorClass: "emerald",
    team: "health",
  },
  onet_researcher: {
    displayName: "O*NET Researcher",
    icon: Briefcase,
    teamColor: "#3b82f6",
    teamColorClass: "blue",
    team: "career",
  },
  trends_analyst: {
    displayName: "Trends Analyst",
    icon: TrendingUp,
    teamColor: "#3b82f6",
    teamColorClass: "blue",
    team: "career",
  },
  pathway_builder: {
    displayName: "Pathway Builder",
    icon: Route,
    teamColor: "#3b82f6",
    teamColorClass: "blue",
    team: "career",
  },
  evidence_grader: {
    displayName: "Evidence Grader",
    icon: Scale,
    teamColor: "#f59e0b",
    teamColorClass: "amber",
    team: "synthesis",
  },
  synthesizer: {
    displayName: "Synthesizer",
    icon: Sparkles,
    teamColor: "#f59e0b",
    teamColorClass: "amber",
    team: "synthesis",
  },
  report_writer: {
    displayName: "Report Writer",
    icon: PenTool,
    teamColor: "#f59e0b",
    teamColorClass: "amber",
    team: "synthesis",
  },
}

export function getAgentConfig(agentId: string): AgentPersonality {
  return (
    AGENT_CONFIG[agentId] ?? {
      displayName: agentId,
      icon: Sparkles,
      teamColor: "#6b7280",
      teamColorClass: "gray",
      team: "synthesis" as const,
    }
  )
}

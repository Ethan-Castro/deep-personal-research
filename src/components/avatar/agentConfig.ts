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
  ShieldCheck,
  Apple,
  Dumbbell,
  DollarSign,
  Puzzle,
  BarChart3,
  Receipt,
  Landmark,
  Calculator,
  Users,
  Share2,
  MapPin,
  Link,
  FileCheck,
  Building2,
  FlaskConical,
  Brain,
  Microscope,
  Salad,
  Cpu,
  GraduationCap,
  LineChart,
  Coins,
  HeartHandshake,
  Globe,
  Layers,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface AgentPersonality {
  displayName: string
  icon: LucideIcon
  teamColor: string      // hex for SVG fills
  teamColorClass: string  // tailwind color token
  team: "orchestrator" | "health" | "career" | "synthesis" | "finance" | "social"
}

// ── Institution Lab Configs ──────────────────────────────────────────────────

export interface LabConfig {
  id: number
  name: string
  domain: AgentPersonality["team"]
  color: string
  colorClass: string
  icon: LucideIcon
}

export const LAB_CONFIGS: LabConfig[] = [
  { id: 1, name: "Biomechanics Lab", domain: "health", color: "#10b981", colorClass: "emerald", icon: Microscope },
  { id: 2, name: "Nutrition Science Lab", domain: "health", color: "#059669", colorClass: "emerald", icon: Salad },
  { id: 3, name: "Genomics Lab", domain: "health", color: "#14b8a6", colorClass: "teal", icon: Dna },
  { id: 4, name: "AI Career Lab", domain: "career", color: "#3b82f6", colorClass: "blue", icon: Cpu },
  { id: 5, name: "Skills Development Lab", domain: "career", color: "#6366f1", colorClass: "indigo", icon: GraduationCap },
  { id: 6, name: "Market Intelligence Lab", domain: "finance", color: "#ec4899", colorClass: "pink", icon: LineChart },
  { id: 7, name: "Tax Strategy Lab", domain: "finance", color: "#f43f5e", colorClass: "rose", icon: Coins },
  { id: 8, name: "Social Capital Lab", domain: "social", color: "#06b6d4", colorClass: "cyan", icon: HeartHandshake },
  { id: 9, name: "Community Impact Lab", domain: "social", color: "#8b5cf6", colorClass: "violet", icon: Globe },
  { id: 10, name: "Cross-Domain Synthesis Lab", domain: "synthesis", color: "#f59e0b", colorClass: "amber", icon: Layers },
]

const LAB_ROLE_ICONS: Record<string, LucideIcon> = {
  pi: Crown,
  ra1: FileText,
  ra2: FileText,
  ra3: FileText,
  spec1: FlaskConical,
  evidence_grader: Scale,
  report_writer: PenTool,
  exec_summarizer: FileCheck,
}

const LAB_ROLE_NAMES: Record<string, string> = {
  pi: "Principal Investigator",
  ra1: "Research Assistant 1",
  ra2: "Research Assistant 2",
  ra3: "Research Assistant 3",
  spec1: "Specialist",
  evidence_grader: "Evidence Grader",
  report_writer: "Report Writer",
  exec_summarizer: "Executive Summarizer",
}

function getLabAgentConfig(agentId: string): AgentPersonality | null {
  const match = agentId.match(/^lab(\d+)_(.+)$/)
  if (!match) return null
  const labNum = parseInt(match[1], 10)
  const role = match[2]
  const lab = LAB_CONFIGS.find((l) => l.id === labNum)
  if (!lab) return null

  return {
    displayName: `${LAB_ROLE_NAMES[role] ?? role} — ${lab.name}`,
    icon: LAB_ROLE_ICONS[role] ?? Brain,
    teamColor: lab.color,
    teamColorClass: lab.colorClass,
    team: lab.domain,
  }
}

export const AGENT_CONFIG: Record<string, AgentPersonality> = {
  // === Orchestrator (purple #a855f7) ===
  supervisor: {
    displayName: "Supervisor",
    icon: Crown,
    teamColor: "#a855f7",
    teamColorClass: "purple",
    team: "orchestrator",
  },
  qa_director: {
    displayName: "QA Director",
    icon: ShieldCheck,
    teamColor: "#a855f7",
    teamColorClass: "purple",
    team: "orchestrator",
  },

  // === Health (emerald #10b981) ===
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
  nutrition_analyst: {
    displayName: "Nutrition Analyst",
    icon: Apple,
    teamColor: "#10b981",
    teamColorClass: "emerald",
    team: "health",
  },
  exercise_scientist: {
    displayName: "Exercise Scientist",
    icon: Dumbbell,
    teamColor: "#10b981",
    teamColorClass: "emerald",
    team: "health",
  },

  // === Career (blue #3b82f6) ===
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
  salary_researcher: {
    displayName: "Salary Researcher",
    icon: DollarSign,
    teamColor: "#3b82f6",
    teamColorClass: "blue",
    team: "career",
  },
  skills_matcher: {
    displayName: "Skills Matcher",
    icon: Puzzle,
    teamColor: "#3b82f6",
    teamColorClass: "blue",
    team: "career",
  },

  // === Finance (pink #ec4899) ===
  market_researcher: {
    displayName: "Market Researcher",
    icon: BarChart3,
    teamColor: "#ec4899",
    teamColorClass: "pink",
    team: "finance",
  },
  tax_analyst: {
    displayName: "Tax Analyst",
    icon: Receipt,
    teamColor: "#ec4899",
    teamColorClass: "pink",
    team: "finance",
  },
  investment_strategist: {
    displayName: "Investment Strategist",
    icon: Landmark,
    teamColor: "#ec4899",
    teamColorClass: "pink",
    team: "finance",
  },
  budget_optimizer: {
    displayName: "Budget Optimizer",
    icon: Calculator,
    teamColor: "#ec4899",
    teamColorClass: "pink",
    team: "finance",
  },

  // === Social (cyan #06b6d4) ===
  social_researcher: {
    displayName: "Social Researcher",
    icon: Users,
    teamColor: "#06b6d4",
    teamColorClass: "cyan",
    team: "social",
  },
  network_analyst: {
    displayName: "Network Analyst",
    icon: Share2,
    teamColor: "#06b6d4",
    teamColorClass: "cyan",
    team: "social",
  },
  community_mapper: {
    displayName: "Community Mapper",
    icon: MapPin,
    teamColor: "#06b6d4",
    teamColorClass: "cyan",
    team: "social",
  },

  // === Synthesis (amber #f59e0b) ===
  evidence_grader: {
    displayName: "Evidence Grader",
    icon: Scale,
    teamColor: "#f59e0b",
    teamColorClass: "amber",
    team: "synthesis",
  },
  cross_domain_linker: {
    displayName: "Cross-Domain Linker",
    icon: Link,
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
  executive_summarizer: {
    displayName: "Executive Summarizer",
    icon: FileCheck,
    teamColor: "#f59e0b",
    teamColorClass: "amber",
    team: "synthesis",
  },
}

export function getAgentConfig(agentId: string): AgentPersonality {
  if (agentId === "institution_director") {
    return {
      displayName: "Institution Director",
      icon: Building2,
      teamColor: "#a855f7",
      teamColorClass: "purple",
      team: "orchestrator",
    }
  }

  const labConfig = getLabAgentConfig(agentId)
  if (labConfig) return labConfig

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

"use client"

import { Dumbbell, GraduationCap, Sparkles } from "lucide-react"
import type { ResearchType } from "@/lib/types"

interface DomainSelectorProps {
  onSelect: (type: ResearchType) => void
}

const domains = [
  {
    type: "health" as ResearchType,
    icon: Dumbbell,
    title: "Health & Fitness",
    description: "Training protocols, nutrition, supplements, genetic heritage analysis",
    examples: [
      "Optimal training volume for your experience level",
      "Genetic predispositions for power vs endurance",
      "Evidence-graded supplement protocols",
    ],
    gradient: "from-emerald-500/10 to-emerald-500/5",
    border: "hover:border-emerald-500/50",
    iconColor: "text-emerald-500",
  },
  {
    type: "career" as ResearchType,
    icon: GraduationCap,
    title: "Career & Education",
    description: "Career pathways, skill gaps, labor market trends, salary data",
    examples: [
      "Best-fit occupations for your skills",
      "Skill gaps and how to close them",
      "Industry growth projections and salary trends",
    ],
    gradient: "from-blue-500/10 to-blue-500/5",
    border: "hover:border-blue-500/50",
    iconColor: "text-blue-500",
  },
  {
    type: "both" as ResearchType,
    icon: Sparkles,
    title: "Full Analysis",
    description: "Cross-domain insights connecting health, fitness, career, and education",
    examples: [
      "All health + career research combined",
      "Cross-domain insights (e.g., athletic strengths → coaching careers)",
      "Comprehensive life strategy report",
    ],
    gradient: "from-amber-500/10 to-amber-500/5",
    border: "hover:border-amber-500/50",
    iconColor: "text-amber-500",
  },
]

export function DomainSelector({ onSelect }: DomainSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {domains.map((d) => (
        <button
          key={d.type}
          onClick={() => onSelect(d.type)}
          className={`group relative rounded-xl border border-border bg-gradient-to-b ${d.gradient} p-6 text-left transition-all hover:shadow-lg ${d.border}`}
        >
          <d.icon className={`mb-4 h-8 w-8 ${d.iconColor}`} />
          <h3 className="mb-2 text-lg font-semibold">{d.title}</h3>
          <p className="mb-4 text-sm text-muted-foreground">{d.description}</p>
          <ul className="space-y-1.5">
            {d.examples.map((ex) => (
              <li key={ex} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${d.iconColor} bg-current`} />
                {ex}
              </li>
            ))}
          </ul>
        </button>
      ))}
    </div>
  )
}

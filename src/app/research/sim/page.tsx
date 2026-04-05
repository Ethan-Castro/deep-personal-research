"use client"

import { useState } from "react"
import { useSimStream } from "@/hooks/useSimStream"
import { useResearchState } from "@/hooks/useResearchState"
import { ConstellationCanvas } from "@/components/constellation/ConstellationCanvas"
import { ProgressBar } from "@/components/constellation/ProgressBar"
import { StatusTimeline } from "@/components/shared/StatusTimeline"
import { ResearchStage } from "@/components/stage/ResearchStage"
import { TransparencyDock } from "@/components/transparency/TransparencyDock"
import { ReportView } from "@/components/report/ReportView"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Dumbbell, GraduationCap, Map, Users } from "lucide-react"
import { SIM_EVENTS } from "@/lib/simData"
import { SIM_CAREER_EVENTS } from "@/lib/simCareer"
import type { SimEvent } from "@/lib/simData"

type Scenario = "health" | "career"
type ViewMode = "avatars" | "constellation"

const SCENARIOS: Record<Scenario, { events: SimEvent[]; label: string; description: string; icon: typeof Dumbbell }> = {
  health: {
    events: SIM_EVENTS,
    label: "Health & Fitness",
    description: "Competitive powerlifter — training protocols, genetic heritage, supplementation",
    icon: Dumbbell,
  },
  career: {
    events: SIM_CAREER_EVENTS,
    label: "Career & Education",
    description: "CS graduate — AI/ML career path, edtech market, skill gap analysis",
    icon: GraduationCap,
  },
}

function SimSelector({ onSelect }: { onSelect: (s: Scenario) => void }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="max-w-md px-4 text-center">
        <Badge variant="secondary" className="mb-4 bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px]">
          SIM MODE
        </Badge>
        <h1 className="mb-2 text-2xl font-bold">Watch a Demo</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Pick a scenario to watch the full research pipeline in action — no API keys needed.
        </p>
        <div className="grid gap-3">
          {(Object.entries(SCENARIOS) as [Scenario, typeof SCENARIOS[Scenario]][]).map(([key, s]) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className="flex items-start gap-4 rounded-xl border border-border p-4 text-left transition-all hover:border-primary/50 hover:shadow-md"
            >
              <s.icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <span className="text-sm font-semibold">{s.label}</span>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ViewToggle({ viewMode, onChange }: { viewMode: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-border bg-muted/50 p-0.5">
      <Button
        variant={viewMode === "avatars" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onChange("avatars")}
        className="h-6 gap-1 px-2 text-[10px]"
      >
        <Users className="h-3 w-3" />
        Agents
      </Button>
      <Button
        variant={viewMode === "constellation" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onChange("constellation")}
        className="h-6 gap-1 px-2 text-[10px]"
      >
        <Map className="h-3 w-3" />
        Map
      </Button>
    </div>
  )
}

function SimRunner({ scenario }: { scenario: Scenario }) {
  const config = SCENARIOS[scenario]
  const [viewMode, setViewMode] = useState<ViewMode>("avatars")
  useSimStream(config.events)

  const status = useResearchState((s) => s.status)
  const reportSections = useResearchState((s) => s.reportSections)
  const hasReport = reportSections.length > 0

  if (status === "idle" || status === "connecting") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Starting simulation...</p>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen">
        <div className={`relative flex flex-col ${hasReport ? "w-[65%]" : "w-full"} transition-all duration-500`}>
          {/* Top bar */}
          <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 flex items-center gap-3">
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px]">
              SIM — {config.label}
            </Badge>
            <ViewToggle viewMode={viewMode} onChange={setViewMode} />
            <ProgressBar status={status} />
          </div>

          {/* Main content area */}
          {viewMode === "avatars" ? (
            <>
              <div className="flex-1">
                <ResearchStage />
              </div>
              <TransparencyDock />
            </>
          ) : (
            <>
              <div className="flex-1">
                <ConstellationCanvas />
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-10 max-w-sm">
                <StatusTimeline />
              </div>
            </>
          )}
        </div>
        {hasReport && (
          <div className="w-[35%] border-l border-border bg-card animate-in slide-in-from-right duration-500">
            <ReportView />
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

export default function SimPage() {
  const [scenario, setScenario] = useState<Scenario | null>(null)

  if (!scenario) {
    return <SimSelector onSelect={setScenario} />
  }

  return <SimRunner key={scenario} scenario={scenario} />
}

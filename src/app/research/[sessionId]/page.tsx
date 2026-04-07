"use client"

import { use, useState } from "react"
import { useAgentStream } from "@/hooks/useAgentStream"
import { useResearchState } from "@/hooks/useResearchState"
import { ConstellationCanvas } from "@/components/constellation/ConstellationCanvas"
import { ProgressBar } from "@/components/constellation/ProgressBar"
import { StatusTimeline } from "@/components/shared/StatusTimeline"
import { ResearchStage } from "@/components/stage/ResearchStage"
import { TransparencyDock } from "@/components/transparency/TransparencyDock"
import { OutputPanel } from "@/components/report/OutputPanel"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Loader2, Map, Users } from "lucide-react"

type ViewMode = "avatars" | "constellation"

export default function ResearchPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = use(params)
  const [viewMode, setViewMode] = useState<ViewMode>("avatars")
  useAgentStream(sessionId)

  const status = useResearchState((s) => s.status)
  const reportSections = useResearchState((s) => s.reportSections)
  const workoutPlan = useResearchState((s) => s.workoutPlan)
  const careerGuide = useResearchState((s) => s.careerGuide)
  const hasOutputs = reportSections.length > 0 || !!workoutPlan || !!careerGuide

  if (status === "idle" || status === "connecting") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Connecting to research session...
          </p>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen">
        {/* Left panel */}
        <div
          className={`relative flex flex-col ${hasOutputs ? "w-[65%]" : "w-full"} transition-all duration-500`}
        >
          {/* Top bar */}
          <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 flex items-center gap-3">
            <div className="flex items-center gap-0.5 rounded-lg border border-border bg-muted/50 p-0.5">
              <Button
                variant={viewMode === "avatars" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("avatars")}
                className="h-6 gap-1 px-2 text-[10px]"
              >
                <Users className="h-3 w-3" />
                Agents
              </Button>
              <Button
                variant={viewMode === "constellation" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("constellation")}
                className="h-6 gap-1 px-2 text-[10px]"
              >
                <Map className="h-3 w-3" />
                Map
              </Button>
            </div>
            <ProgressBar status={status} />
          </div>

          {/* Main content */}
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

        {/* Right panel — Output viewer (slides in) */}
        {hasOutputs && (
          <div className="w-[35%] border-l border-border bg-card animate-in slide-in-from-right duration-500">
            <OutputPanel />
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

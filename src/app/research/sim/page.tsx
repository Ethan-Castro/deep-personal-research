"use client"

import { useSimStream } from "@/hooks/useSimStream"
import { useResearchState } from "@/hooks/useResearchState"
import { ConstellationCanvas } from "@/components/constellation/ConstellationCanvas"
import { ProgressBar } from "@/components/constellation/ProgressBar"
import { StatusTimeline } from "@/components/shared/StatusTimeline"
import { ReportView } from "@/components/report/ReportView"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

export default function SimPage() {
  useSimStream()

  const status = useResearchState((s) => s.status)
  const reportSections = useResearchState((s) => s.reportSections)
  const hasReport = reportSections.length > 0

  if (status === "idle" || status === "connecting") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Starting simulation...
          </p>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen">
        {/* Left panel — Constellation map */}
        <div
          className={`relative flex flex-col ${hasReport ? "w-[65%]" : "w-full"} transition-all duration-500`}
        >
          {/* Sim badge + Progress bar overlay */}
          <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 flex items-center gap-3">
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px]">
              SIM MODE
            </Badge>
            <ProgressBar status={status} />
          </div>

          {/* Map */}
          <div className="flex-1">
            <ConstellationCanvas />
          </div>

          {/* Status timeline overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-10 max-w-sm">
            <StatusTimeline />
          </div>
        </div>

        {/* Right panel — Report viewer (slides in) */}
        {hasReport && (
          <div className="w-[35%] border-l border-border bg-card animate-in slide-in-from-right duration-500">
            <ReportView />
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

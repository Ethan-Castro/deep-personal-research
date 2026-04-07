"use client"

import { useState } from "react"
import { useResearchState } from "@/hooks/useResearchState"
import { ReportView } from "./ReportView"
import { WorkoutPlanView } from "./WorkoutPlanView"
import { CareerGuideView } from "./CareerGuideView"
import { FileText, Dumbbell, GraduationCap } from "lucide-react"
import type { OutputType } from "@/lib/types"

interface TabConfig {
  id: OutputType
  label: string
  icon: typeof FileText
  available: boolean
}

export function OutputPanel() {
  const reportSections = useResearchState((s) => s.reportSections)
  const workoutPlan = useResearchState((s) => s.workoutPlan)
  const careerGuide = useResearchState((s) => s.careerGuide)
  const status = useResearchState((s) => s.status)

  const hasReport = reportSections.length > 0
  const isGenerating = status === "writing" || status === "synthesizing"

  const tabs: TabConfig[] = [
    {
      id: "paper",
      label: "Paper",
      icon: FileText,
      available: hasReport,
    },
    {
      id: "workout_plan",
      label: "Workout",
      icon: Dumbbell,
      available: !!workoutPlan || isGenerating,
    },
    {
      id: "career_guide",
      label: "Career",
      icon: GraduationCap,
      available: !!careerGuide || isGenerating,
    },
  ]

  const visibleTabs = tabs.filter((t) => t.available)
  const [activeTab, setActiveTab] = useState<OutputType>("paper")

  // Auto-switch to first available tab if current isn't available
  const resolvedTab = visibleTabs.find((t) => t.id === activeTab)
    ? activeTab
    : visibleTabs[0]?.id ?? "paper"

  return (
    <div className="flex h-full flex-col">
      {/* Tab bar */}
      {visibleTabs.length > 1 && (
        <div className="flex items-center gap-0.5 border-b border-border bg-card/80 px-3 py-1.5 backdrop-blur-sm">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = resolvedTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {resolvedTab === "paper" && <ReportView />}
        {resolvedTab === "workout_plan" && <WorkoutPlanView />}
        {resolvedTab === "career_guide" && <CareerGuideView />}
      </div>
    </div>
  )
}

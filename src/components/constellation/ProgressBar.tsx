"use client"

import React from "react"

const stages = [
  { key: "briefing", label: "Brief" },
  { key: "researching", label: "Research" },
  { key: "grading", label: "Grading" },
  { key: "synthesizing", label: "Synthesis" },
  { key: "writing", label: "Report" },
  { key: "complete", label: "Done" },
]

const stageOrder = stages.map((s) => s.key)

interface ProgressBarProps {
  status: string
}

export function ProgressBar({ status }: ProgressBarProps) {
  const currentIndex = stageOrder.indexOf(status)

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-card/80 px-3 py-1.5 backdrop-blur-sm">
      {stages.map((stage, i) => {
        const isActive = i === currentIndex
        const isDone = i < currentIndex

        return (
          <React.Fragment key={stage.key}>
            {i > 0 && (
              <div
                className={`h-px w-4 ${isDone ? "bg-primary" : "bg-border"}`}
              />
            )}
            <div className="flex items-center gap-1">
              <div
                className={`h-2 w-2 rounded-full ${
                  isActive
                    ? "bg-primary animate-pulse"
                    : isDone
                      ? "bg-primary"
                      : "bg-muted"
                }`}
              />
              <span
                className={`text-[10px] ${
                  isActive
                    ? "font-semibold text-foreground"
                    : isDone
                      ? "text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {stage.label}
              </span>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

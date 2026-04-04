"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { EvidenceGrade } from "@/lib/types"

const gradeConfig: Record<
  string,
  { color: string; bg: string; label: string }
> = {
  A: {
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    label: "Meta-analysis / Systematic Review",
  },
  B: {
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/40",
    label: "Multiple RCTs",
  },
  C: {
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/40",
    label: "Single RCT / Strong Observational",
  },
  D: {
    color: "text-orange-700 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-900/40",
    label: "Preliminary / Limited Evidence",
  },
  F: {
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/40",
    label: "Expert Consensus Only",
  },
}

interface EvidenceBadgeProps {
  grade: EvidenceGrade
  size?: "sm" | "md"
}

export function EvidenceBadge({ grade, size = "md" }: EvidenceBadgeProps) {
  const config = gradeConfig[grade] ?? gradeConfig.F

  const sizeClass =
    size === "sm"
      ? "h-4 w-4 text-[9px]"
      : "h-5 w-5 text-[10px]"

  return (
    <Tooltip>
      <TooltipTrigger
        className={`inline-flex items-center justify-center rounded-full font-bold cursor-default ${config.bg} ${config.color} ${sizeClass}`}
      >
        {grade}
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="text-xs">
          <strong>Grade {grade}:</strong> {config.label}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}

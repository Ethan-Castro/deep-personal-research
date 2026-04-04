"use client"

import React from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { EvidenceBadge } from "@/components/report/EvidenceBadge"
import type { EvidenceGrade } from "@/lib/types"

function InsightNodeComponent({ data }: NodeProps) {
  const grade = String(data.evidenceGrade ?? "C") as EvidenceGrade
  const domain = String(data.domain ?? "")

  const borderColor =
    domain === "cross_domain"
      ? "border-amber-500"
      : domain === "health"
        ? "border-emerald-500"
        : "border-blue-500"

  return (
    <div
      className={`max-w-[200px] rounded-lg border-2 ${borderColor} bg-gradient-to-b from-amber-500/5 to-transparent p-3 shadow-lg`}
    >
      <Handle type="target" position={Position.Top} className="!bg-amber-500" />

      <div className="mb-1 flex items-center gap-1.5">
        <EvidenceBadge grade={grade} size="sm" />
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
          {domain.replace("_", " ")}
        </span>
      </div>

      <p className="text-xs font-semibold leading-tight">{String(data.title ?? "")}</p>

      {data.content ? (
        <p className="mt-1 text-[10px] leading-tight text-muted-foreground line-clamp-3">
          {String(data.content)}
        </p>
      ) : null}
    </div>
  )
}

export const InsightNode = React.memo(InsightNodeComponent)

"use client"

import React from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { useResearchState } from "@/hooks/useResearchState"

function CenterNodeComponent({ data, id }: NodeProps) {
  const selected = useResearchState((s) => s.selectedNodeId === id)

  return (
    <div className={`relative flex h-20 w-20 items-center justify-center cursor-pointer ${selected ? "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-full" : ""}`}>
      {/* Pulsing ring */}
      <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-primary/10" />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center">
        <span className="text-xs font-bold tracking-wide">PI</span>
        <span className="text-[9px] text-muted-foreground">{String(data.researchType ?? "")}</span>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </div>
  )
}

export const CenterNode = React.memo(CenterNodeComponent)

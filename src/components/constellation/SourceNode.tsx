"use client"

import React from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Database } from "lucide-react"
import { useResearchState } from "@/hooks/useResearchState"

function SourceNodeComponent({ data, id }: NodeProps) {
  const toolName = String(data.toolName ?? "")
  const selected = useResearchState((s) => s.selectedNodeId === id)

  const label =
    toolName.includes("pubmed")
      ? "PubMed"
      : toolName.includes("exa")
        ? "Exa"
        : toolName.includes("onet")
          ? "O*NET"
          : toolName

  return (
    <div className={`relative flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted shadow-sm cursor-pointer transition-all hover:shadow-md ${selected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}>
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground !h-1.5 !w-1.5" />
      <Database className="h-3 w-3 text-muted-foreground" />
      <span className="absolute -bottom-3.5 text-[8px] text-muted-foreground whitespace-nowrap">
        {label}
      </span>
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground !h-1.5 !w-1.5" />
    </div>
  )
}

export const SourceNode = React.memo(SourceNodeComponent)

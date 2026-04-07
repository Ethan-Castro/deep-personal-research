"use client"

import React from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Crown, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { useZoomLevel } from "./useZoomLevel"

function PIAgentNodeComponent({ data }: NodeProps) {
  const zoomLevel = useZoomLevel()
  const status = String(data.status ?? "running")
  const label = String(data.label ?? "")

  if (zoomLevel === "far") {
    return (
      <div className="h-4 w-4 rounded-full bg-amber-500/80">
        <Handle type="target" position={Position.Top} className="!bg-transparent !w-0 !h-0" />
        <Handle type="source" position={Position.Bottom} className="!bg-transparent !w-0 !h-0" />
      </div>
    )
  }

  return (
    <div className="min-w-[180px] max-w-[180px] rounded-lg border-2 border-amber-500/50 bg-card p-3 shadow-md cursor-pointer ring-2 ring-amber-500/20">
      <Handle type="target" position={Position.Top} className="!bg-amber-500" />

      <div className="mb-1.5 flex items-center gap-1.5">
        <Crown className="h-3.5 w-3.5 text-amber-500" />
        {status === "running" && <Loader2 className="h-3 w-3 animate-spin text-amber-500" />}
        {status === "complete" && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
        {status === "error" && <AlertCircle className="h-3 w-3 text-destructive" />}
        <span className="text-xs font-semibold truncate">{label}</span>
      </div>

      {data.role ? (
        <span className="mb-1 inline-block rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[9px] text-amber-500">
          {String(data.role)}
        </span>
      ) : null}

      {data.thought && status === "running" && zoomLevel === "close" ? (
        <p className="mt-1 text-[10px] leading-tight text-muted-foreground line-clamp-2">
          {String(data.thought)}
        </p>
      ) : null}

      <Handle type="source" position={Position.Bottom} className="!bg-amber-500" />
    </div>
  )
}

export const PIAgentNode = React.memo(PIAgentNodeComponent)

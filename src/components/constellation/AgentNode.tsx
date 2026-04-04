"use client"

import React from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"

function AgentNodeComponent({ data }: NodeProps) {
  const status = String(data.status ?? "running")
  const team = String(data.team ?? "")

  const teamColor =
    team === "health" || team === "orchestrator"
      ? "border-emerald-500/50"
      : team === "career"
        ? "border-blue-500/50"
        : "border-amber-500/50"

  return (
    <div
      className={`min-w-[140px] max-w-[180px] rounded-lg border-2 ${teamColor} bg-card p-3 shadow-md`}
    >
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />

      <div className="mb-1.5 flex items-center gap-1.5">
        {status === "running" && <Loader2 className="h-3 w-3 animate-spin text-amber-500" />}
        {status === "complete" && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
        {status === "error" && <AlertCircle className="h-3 w-3 text-destructive" />}
        <span className="text-xs font-semibold truncate">{String(data.label ?? "")}</span>
      </div>

      {data.role ? (
        <span className="mb-1 inline-block rounded-full bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
          {String(data.role)}
        </span>
      ) : null}

      {data.thought && status === "running" ? (
        <p className="mt-1 text-[10px] leading-tight text-muted-foreground line-clamp-2">
          {String(data.thought)}
        </p>
      ) : null}

      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
    </div>
  )
}

export const AgentNode = React.memo(AgentNodeComponent)

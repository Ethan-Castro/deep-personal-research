"use client"

import React from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { useZoomLevel } from "./useZoomLevel"

function LabGroupNodeComponent({ data, id }: NodeProps) {
  const zoomLevel = useZoomLevel()
  const labColor = String(data.labColor ?? "#6b7280")
  const labName = String(data.label ?? "Lab")
  const status = String(data.status ?? "running")

  if (zoomLevel === "far") {
    return (
      <div
        className="rounded-xl"
        style={{
          width: 500,
          height: 420,
          backgroundColor: `${labColor}20`,
          border: `2px solid ${labColor}40`,
        }}
      >
        <div className="flex items-center justify-center h-full">
          <span className="text-sm font-bold" style={{ color: labColor }}>
            {labName}
          </span>
        </div>
        <Handle type="target" position={Position.Top} className="!bg-transparent" id={`${id}-target`} />
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl relative"
      style={{
        width: 500,
        height: 420,
        background: `linear-gradient(180deg, ${labColor}0D 0%, transparent 60%)`,
        border: `2px solid ${labColor}40`,
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-t-2xl"
        style={{ backgroundColor: `${labColor}15` }}
      >
        <div
          className="h-2 w-2 rounded-full"
          style={{
            backgroundColor: status === "complete" ? "#10b981" : labColor,
            boxShadow: status === "running" ? `0 0 6px ${labColor}` : "none",
          }}
        />
        <span className="text-[11px] font-semibold" style={{ color: labColor }}>
          {labName}
        </span>
      </div>

      <Handle type="target" position={Position.Top} className="!bg-transparent" id={`${id}-target`} />
    </div>
  )
}

export const LabGroupNode = React.memo(LabGroupNodeComponent)

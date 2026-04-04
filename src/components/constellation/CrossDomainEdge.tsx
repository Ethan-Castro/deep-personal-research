"use client"

import React from "react"
import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react"

const edgeColors: Record<string, string> = {
  request: "#3b82f6",
  finding: "#22c55e",
  synthesis: "#eab308",
}

function CrossDomainEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  const edgeType = String(data?.edgeType ?? "request")
  const color = edgeColors[edgeType] ?? "#6b7280"

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: color, strokeWidth: 1.5, strokeOpacity: 0.6 }}
      />
      {/* Animated dot traveling along the edge */}
      <circle r="3" fill={color} opacity={0.8}>
        <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  )
}

export const CrossDomainEdge = React.memo(CrossDomainEdgeComponent)

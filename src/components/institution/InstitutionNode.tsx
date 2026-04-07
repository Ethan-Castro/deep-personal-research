"use client"

import React from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Building2 } from "lucide-react"

function InstitutionNodeComponent({ id }: NodeProps) {
  return (
    <div className="relative flex h-[120px] w-[120px] items-center justify-center cursor-pointer">
      {/* Pulsing ring */}
      <div className="absolute inset-0 animate-ping rounded-full bg-purple-500/20" style={{ animationDuration: "3s" }} />
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600/40 to-violet-500/20 border-2 border-purple-500/30" />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-1">
        <Building2 className="h-7 w-7 text-purple-400" />
        <span className="text-[10px] font-bold text-purple-300 tracking-wide">Personal PI</span>
        <span className="text-[8px] text-purple-400/70">Institution</span>
      </div>

      <Handle type="source" position={Position.Top} className="!bg-purple-500" id={`${id}-top`} />
      <Handle type="source" position={Position.Right} className="!bg-purple-500" id={`${id}-right`} />
      <Handle type="source" position={Position.Bottom} className="!bg-purple-500" id={`${id}-bottom`} />
      <Handle type="source" position={Position.Left} className="!bg-purple-500" id={`${id}-left`} />
    </div>
  )
}

export const InstitutionNode = React.memo(InstitutionNodeComponent)

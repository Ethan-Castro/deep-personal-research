"use client"

import React from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { EvidenceBadge } from "@/components/report/EvidenceBadge"
import type { EvidenceGrade } from "@/lib/types"
import { FileText, Globe, Briefcase } from "lucide-react"
import { useResearchState } from "@/hooks/useResearchState"

const sourceIcons: Record<string, React.ReactNode> = {
  pubmed: <FileText className="h-3 w-3 text-emerald-500" />,
  exa: <Globe className="h-3 w-3 text-blue-500" />,
  onet: <Briefcase className="h-3 w-3 text-purple-500" />,
}

function FindingNodeComponent({ data, id }: NodeProps) {
  const grade = String(data.evidenceGrade ?? "C") as EvidenceGrade
  const sourceType = String(data.sourceType ?? "other")
  const selected = useResearchState((s) => s.selectedNodeId === id)

  return (
    <div className={`max-w-[160px] rounded-md border border-border bg-card/80 p-2 shadow-sm cursor-pointer transition-all hover:shadow-md ${selected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}>
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />

      <div className="mb-1 flex items-center gap-1.5">
        {sourceIcons[sourceType] ?? <Globe className="h-3 w-3 text-muted-foreground" />}
        <EvidenceBadge grade={grade} size="sm" />
      </div>

      <p className="text-[10px] font-medium leading-tight line-clamp-2">
        {String(data.title ?? "")}
      </p>

      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
    </div>
  )
}

export const FindingNode = React.memo(FindingNodeComponent)

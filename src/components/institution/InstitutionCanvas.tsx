"use client"

import { useMemo, useCallback } from "react"
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  type Node,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { useResearchState } from "@/hooks/useResearchState"
import { getInstitutionLayout } from "./InstitutionLayout"
import { InstitutionNode } from "./InstitutionNode"
import { LabGroupNode } from "./LabGroupNode"
import { PIAgentNode } from "./PIAgentNode"
import { AgentNode } from "../constellation/AgentNode"
import { FindingNode } from "../constellation/FindingNode"
import { SourceNode } from "../constellation/SourceNode"
import { InsightNode } from "../constellation/InsightNode"
import { CrossDomainEdge } from "../constellation/CrossDomainEdge"

const nodeTypes = {
  institution: InstitutionNode,
  labGroup: LabGroupNode,
  piAgent: PIAgentNode,
  agent: AgentNode,
  center: InstitutionNode,
  finding: FindingNode,
  source: SourceNode,
  insight: InsightNode,
}

const edgeTypes = {
  dataFlow: CrossDomainEdge,
}

const TEAM_COLORS: Record<string, string> = {
  health: "#10b981",
  career: "#3b82f6",
  finance: "#ec4899",
  social: "#06b6d4",
  synthesis: "#f59e0b",
  orchestrator: "#a855f7",
}

function nodeColor(node: Node): string {
  if (node.type === "institution" || node.type === "center") return "#a855f7"
  if (node.type === "labGroup") return String(node.data.labColor ?? "#6b7280")
  const team = String(node.data.team ?? "")
  return TEAM_COLORS[team] ?? "#6b7280"
}

function InstitutionInner() {
  const nodes = useResearchState((s) => s.nodes)
  const edges = useResearchState((s) => s.edges)
  const selectNode = useResearchState((s) => s.selectNode)

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return getInstitutionLayout(nodes, edges)
  }, [nodes, edges])

  const onNodesChange = useCallback(() => {}, [])
  const onEdgesChange = useCallback(() => {}, [])

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id)
    },
    [selectNode]
  )

  const onPaneClick = useCallback(() => {
    selectNode(null)
  }, [selectNode])

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={layoutedNodes}
        edges={layoutedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ maxZoom: 0.25, padding: 0.15 }}
        minZoom={0.05}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
      >
        <Controls position="bottom-left" showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          position="bottom-right"
          className="!bg-card/80 !border-border"
          style={{ width: 200, height: 150 }}
          nodeColor={nodeColor}
        />
        <Background variant={BackgroundVariant.Cross} gap={40} size={1} color="#222" />
      </ReactFlow>
    </div>
  )
}

export function InstitutionCanvas() {
  return (
    <ReactFlowProvider>
      <InstitutionInner />
    </ReactFlowProvider>
  )
}

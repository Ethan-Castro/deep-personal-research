"use client"

import { useEffect, useRef, useMemo, useCallback } from "react"
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
  type Node,
  type Edge,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { useResearchState } from "@/hooks/useResearchState"
import { getLayoutedElements } from "./MapLayout"
import { CenterNode } from "./CenterNode"
import { AgentNode } from "./AgentNode"
import { FindingNode } from "./FindingNode"
import { SourceNode } from "./SourceNode"
import { InsightNode } from "./InsightNode"
import { CrossDomainEdge } from "./CrossDomainEdge"
import { DetailPanel } from "./DetailPanel"

const nodeTypes = {
  center: CenterNode,
  agent: AgentNode,
  finding: FindingNode,
  source: SourceNode,
  insight: InsightNode,
}

const edgeTypes = {
  dataFlow: CrossDomainEdge,
}

function ConstellationInner() {
  const { fitView } = useReactFlow()
  const nodes = useResearchState((s) => s.nodes)
  const edges = useResearchState((s) => s.edges)
  const selectNode = useResearchState((s) => s.selectNode)
  const selectedNodeId = useResearchState((s) => s.selectedNodeId)
  const prevCountRef = useRef(0)

  // Re-layout when nodes are added (structural change)
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return getLayoutedElements(nodes, edges)
  }, [nodes, edges])

  // Fit view when new nodes are added
  useEffect(() => {
    if (layoutedNodes.length > prevCountRef.current) {
      prevCountRef.current = layoutedNodes.length
      // Small delay to let React render the new nodes first
      const timer = setTimeout(() => {
        fitView({ duration: 400, padding: 0.15 })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [layoutedNodes.length, fitView])

  const onNodesChange = useCallback(() => {
    // Handled by store — read-only flow
  }, [])

  const onEdgesChange = useCallback(() => {
    // Handled by store — read-only flow
  }, [])

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
        minZoom={0.1}
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
        />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#333" />
      </ReactFlow>
      {selectedNodeId && <DetailPanel />}
    </div>
  )
}

export function ConstellationCanvas() {
  return (
    <ReactFlowProvider>
      <ConstellationInner />
    </ReactFlowProvider>
  )
}

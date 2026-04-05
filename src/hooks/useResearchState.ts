"use client"

import { create } from "zustand"
import type { Node, Edge } from "@xyflow/react"
import type { Finding, Insight, ReportSection } from "@/lib/types"
import type { AgentEvent } from "@/lib/events"

interface ResearchStore {
  // Session
  sessionId: string | null
  status:
    | "idle"
    | "connecting"
    | "briefing"
    | "researching"
    | "grading"
    | "synthesizing"
    | "writing"
    | "complete"
    | "error"

  // Constellation map
  nodes: Node[]
  edges: Edge[]

  // Detail panel
  selectedNodeId: string | null

  // Data
  findings: Finding[]
  insights: Insight[]
  reportSections: ReportSection[]
  reportId: string | null

  // Activity log
  activityLog: AgentEvent[]

  // Actions
  setSessionId: (id: string) => void
  setStatus: (status: ResearchStore["status"]) => void
  addNode: (node: Node) => void
  updateNode: (id: string, data: Record<string, unknown>) => void
  addEdge: (edge: Edge) => void
  selectNode: (id: string | null) => void
  addFinding: (finding: Finding) => void
  addInsight: (insight: Insight) => void
  addReportSection: (section: ReportSection) => void
  setReportId: (id: string) => void
  addActivity: (event: AgentEvent) => void
  reset: () => void
}

const initialState = {
  sessionId: null,
  status: "idle" as const,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  findings: [],
  insights: [],
  reportSections: [],
  reportId: null,
  activityLog: [],
}

export const useResearchState = create<ResearchStore>((set) => ({
  ...initialState,

  setSessionId: (id) => set({ sessionId: id }),

  setStatus: (status) => set({ status }),

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  updateNode: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    })),

  addEdge: (edge) =>
    set((state) => ({
      edges: [...state.edges, edge],
    })),

  selectNode: (id) => set({ selectedNodeId: id }),

  addFinding: (finding) =>
    set((state) => ({
      findings: [...state.findings, finding],
    })),

  addInsight: (insight) =>
    set((state) => ({
      insights: [...state.insights, insight],
    })),

  addReportSection: (section) =>
    set((state) => ({
      reportSections: [...state.reportSections, section],
    })),

  setReportId: (id) => set({ reportId: id }),

  addActivity: (event) =>
    set((state) => ({
      activityLog: [...state.activityLog, event],
    })),

  reset: () => set(initialState),
}))

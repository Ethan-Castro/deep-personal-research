"use client"

import type { Node } from "@xyflow/react"
import type { AgentEvent } from "@/lib/events"
import type { Finding, Insight, EvidenceGrade } from "@/lib/types"
import { useResearchState } from "@/hooks/useResearchState"
import { EvidenceBadge } from "@/components/report/EvidenceBadge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  X,
  Bot,
  FileText,
  Globe,
  Briefcase,
  Database,
  Lightbulb,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Brain,
  Search,
  ExternalLink,
} from "lucide-react"

export function DetailPanel() {
  const selectedNodeId = useResearchState((s) => s.selectedNodeId)
  const nodes = useResearchState((s) => s.nodes)
  const edges = useResearchState((s) => s.edges)
  const findings = useResearchState((s) => s.findings)
  const insights = useResearchState((s) => s.insights)
  const activityLog = useResearchState((s) => s.activityLog)
  const selectNode = useResearchState((s) => s.selectNode)

  if (!selectedNodeId) return null

  const node = nodes.find((n) => n.id === selectedNodeId)
  if (!node) return null

  // Find connected edges and nodes
  const childEdges = edges.filter((e) => e.source === selectedNodeId)
  const parentEdges = edges.filter((e) => e.target === selectedNodeId)
  const childNodes = childEdges
    .map((e) => nodes.find((n) => n.id === e.target))
    .filter(Boolean)
  const parentNodes = parentEdges
    .map((e) => nodes.find((n) => n.id === e.source))
    .filter(Boolean)

  // Find activity log entries for this node
  const nodeActivity = activityLog.filter(
    (e) => e.agentId === selectedNodeId
  )

  return (
    <div className="absolute right-0 top-0 bottom-0 z-20 w-[380px] border-l border-border bg-card shadow-2xl animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <NodeIcon type={node.type ?? "agent"} data={node.data} />
          <span className="text-sm font-semibold truncate">
            {String(node.data.label ?? node.data.name ?? node.data.title ?? node.data.toolName ?? node.id)}
          </span>
        </div>
        <button
          onClick={() => selectNode(null)}
          className="shrink-0 rounded-md p-1 hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <ScrollArea className="h-[calc(100%-52px)]">
        <div className="space-y-4 p-4">
          {/* Render based on node type */}
          {node.type === "center" && <CenterDetail data={node.data} />}
          {node.type === "agent" && (
            <AgentDetail
              data={node.data}
              childNodes={childNodes}
              activity={nodeActivity}
              onNavigate={selectNode}
            />
          )}
          {node.type === "finding" && (
            <FindingDetail
              data={node.data}
              nodeId={selectedNodeId}
              findings={findings}
              parentNodes={parentNodes}
              onNavigate={selectNode}
            />
          )}
          {node.type === "source" && (
            <SourceDetail data={node.data} parentNodes={parentNodes} onNavigate={selectNode} />
          )}
          {node.type === "insight" && (
            <InsightDetail
              data={node.data}
              nodeId={selectedNodeId}
              insights={insights}
              parentNodes={parentNodes}
              onNavigate={selectNode}
            />
          )}

          {/* Connections section — shown for all types */}
          {(parentNodes.length > 0 || childNodes.length > 0) && (
            <>
              <Separator />
              <div>
                <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Connections
                </h4>
                {parentNodes.length > 0 && (
                  <div className="mb-2">
                    <span className="text-[10px] text-muted-foreground">From:</span>
                    <div className="mt-1 space-y-1">
                      {parentNodes.map((pn) => pn && (
                        <button
                          key={pn.id}
                          onClick={() => selectNode(pn.id)}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-xs hover:bg-muted"
                        >
                          <NodeIcon type={pn.type ?? "agent"} data={pn.data} size="sm" />
                          <span className="truncate">
                            {String(pn.data.label ?? pn.data.name ?? pn.data.title ?? pn.data.toolName ?? pn.id)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {childNodes.length > 0 && (
                  <div>
                    <span className="text-[10px] text-muted-foreground">To:</span>
                    <div className="mt-1 space-y-1">
                      {childNodes.map((cn) => cn && (
                        <button
                          key={cn.id}
                          onClick={() => selectNode(cn.id)}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-xs hover:bg-muted"
                        >
                          <NodeIcon type={cn.type ?? "agent"} data={cn.data} size="sm" />
                          <span className="truncate">
                            {String(cn.data.label ?? cn.data.name ?? cn.data.title ?? cn.data.toolName ?? cn.id)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

// === Sub-components for each node type ===

function NodeIcon({ type, data, size = "md" }: { type: string; data: Record<string, unknown>; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "h-3 w-3" : "h-4 w-4"
  switch (type) {
    case "center":
      return <Brain className={`${cls} text-primary`} />
    case "agent": {
      const status = String(data.status ?? "running")
      if (status === "running") return <Loader2 className={`${cls} text-amber-500 animate-spin`} />
      if (status === "complete") return <CheckCircle2 className={`${cls} text-emerald-500`} />
      if (status === "error") return <AlertCircle className={`${cls} text-destructive`} />
      return <Bot className={`${cls} text-muted-foreground`} />
    }
    case "finding": {
      const st = String(data.sourceType ?? "other")
      if (st === "pubmed") return <FileText className={`${cls} text-emerald-500`} />
      if (st === "exa") return <Globe className={`${cls} text-blue-500`} />
      if (st === "onet") return <Briefcase className={`${cls} text-purple-500`} />
      return <FileText className={`${cls} text-muted-foreground`} />
    }
    case "source":
      return <Database className={`${cls} text-muted-foreground`} />
    case "insight":
      return <Lightbulb className={`${cls} text-amber-500`} />
    default:
      return <Bot className={`${cls} text-muted-foreground`} />
  }
}

function CenterDetail({ data }: { data: Record<string, unknown> }) {
  return (
    <div>
      <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Orchestrator
      </h4>
      <p className="text-sm">
        Personal PI research orchestrator coordinating all agents for a{" "}
        <Badge variant="secondary" className="text-[10px]">
          {String(data.researchType ?? "unknown")}
        </Badge>{" "}
        research session.
      </p>
    </div>
  )
}

function AgentDetail({
  data,
  childNodes,
  activity,
  onNavigate,
}: {
  data: Record<string, unknown>
  childNodes: (Node | undefined)[]
  activity: AgentEvent[]
  onNavigate: (id: string) => void
}) {
  const status = String(data.status ?? "running")
  const findingsCount = childNodes.filter((n) => n?.type === "finding").length
  const toolCallCount = childNodes.filter((n) => n?.type === "source").length

  return (
    <>
      {/* Status + Role */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Badge
            variant={status === "complete" ? "default" : status === "error" ? "destructive" : "secondary"}
            className="text-[10px]"
          >
            {status}
          </Badge>
          {data.team ? (
            <Badge variant="outline" className="text-[10px]">
              {String(data.team)}
            </Badge>
          ) : null}
        </div>
        {data.role ? (
          <p className="text-sm text-muted-foreground">{String(data.role)}</p>
        ) : null}
      </div>

      {/* Description */}
      {data.description ? (
        <div>
          <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Purpose
          </h4>
          <p className="text-sm">{String(data.description)}</p>
        </div>
      ) : null}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md bg-muted/50 p-2">
          <p className="text-lg font-bold">{findingsCount}</p>
          <p className="text-[10px] text-muted-foreground">Findings</p>
        </div>
        <div className="rounded-md bg-muted/50 p-2">
          <p className="text-lg font-bold">{toolCallCount}</p>
          <p className="text-[10px] text-muted-foreground">Tool Calls</p>
        </div>
      </div>

      {/* Current thought */}
      {data.thought ? (
        <div>
          <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {status === "running" ? "Current Thought" : "Last Thought"}
          </h4>
          <div className="rounded-md bg-muted/50 p-2">
            <p className="text-xs italic text-muted-foreground">&quot;{String(data.thought)}&quot;</p>
          </div>
        </div>
      ) : null}

      {/* Activity log */}
      {activity.length > 0 ? (
        <div>
          <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Activity Log ({activity.length} events)
          </h4>
          <div className="space-y-1 rounded-md bg-muted/30 p-2 max-h-48 overflow-y-auto">
            {activity.map((ev, i) => (
              <div key={i} className="flex items-start gap-1.5 text-[11px]">
                <ActivityIcon type={ev.type} />
                <span className="text-muted-foreground leading-tight">
                  {activityLabel(ev)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  )
}

function FindingDetail({
  data,
  nodeId,
  findings,
  parentNodes,
  onNavigate,
}: {
  data: Record<string, unknown>
  nodeId: string
  findings: Finding[]
  parentNodes: (Node | undefined)[]
  onNavigate: (id: string) => void
}) {
  const grade = String(data.evidenceGrade ?? "C") as EvidenceGrade
  const findingId = nodeId.replace("finding_", "")
  const finding = findings.find((f) => f.id === findingId)

  return (
    <>
      {/* Evidence Grade */}
      <div className="flex items-center gap-2">
        <EvidenceBadge grade={grade} />
        <span className="text-sm font-medium">Evidence Grade {grade}</span>
      </div>

      {/* Title */}
      <div>
        <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Finding
        </h4>
        <p className="text-sm font-semibold">{String(data.title ?? "")}</p>
      </div>

      {/* Full Summary */}
      <div>
        <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Full Summary
        </h4>
        <p className="text-sm leading-relaxed">{String(data.summary ?? finding?.summary ?? "")}</p>
      </div>

      {/* Source info */}
      {finding ? (
        <div>
          <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Source
          </h4>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">
                {finding.sourceType}
              </Badge>
              <span className="text-xs text-muted-foreground">{finding.source}</span>
            </div>
            {finding.sourceUrl ? (
              <div className="flex items-center gap-1 text-xs text-blue-500">
                <ExternalLink className="h-3 w-3" />
                <span className="truncate">{finding.sourceUrl}</span>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Agent that found this */}
      {finding?.agentId ? (
        <div>
          <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Found By
          </h4>
          <button
            onClick={() => onNavigate(finding.agentId)}
            className="flex items-center gap-2 text-xs text-blue-500 hover:underline"
          >
            <Bot className="h-3 w-3" />
            {finding.agentId}
          </button>
        </div>
      ) : null}
    </>
  )
}

function SourceDetail({
  data,
  parentNodes,
  onNavigate,
}: {
  data: Record<string, unknown>
  parentNodes: (Node | undefined)[]
  onNavigate: (id: string) => void
}) {
  const toolName = String(data.toolName ?? "")

  const label = toolName.includes("pubmed")
    ? "PubMed E-utilities"
    : toolName.includes("exa_deep")
      ? "Exa Deep Research"
      : toolName.includes("exa")
        ? "Exa AI Search"
        : toolName.includes("onet")
          ? "O*NET Web Services"
          : toolName

  return (
    <>
      <div>
        <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Tool Call
        </h4>
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">{label}</span>
        </div>
      </div>

      <div>
        <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Function
        </h4>
        <code className="block rounded-md bg-muted/50 px-2 py-1 text-xs font-mono">
          {toolName}
        </code>
      </div>

      {data.query ? (
        <div>
          <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Input
          </h4>
          <pre className="whitespace-pre-wrap rounded-md bg-muted/50 p-2 text-xs font-mono leading-relaxed">
            {String(data.query)}
          </pre>
        </div>
      ) : null}

      {data.preview ? (
        <div>
          <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Output Preview
          </h4>
          <pre className="whitespace-pre-wrap rounded-md bg-muted/50 p-2 text-xs font-mono leading-relaxed text-muted-foreground">
            {String(data.preview)}
          </pre>
        </div>
      ) : null}
    </>
  )
}

function InsightDetail({
  data,
  nodeId,
  insights,
  parentNodes,
  onNavigate,
}: {
  data: Record<string, unknown>
  nodeId: string
  insights: Insight[]
  parentNodes: (Node | undefined)[]
  onNavigate: (id: string) => void
}) {
  const grade = String(data.evidenceGrade ?? "C") as EvidenceGrade
  const insightId = nodeId.replace("insight_", "")
  const insight = insights.find((ins) => ins.id === insightId)

  return (
    <>
      {/* Evidence Grade */}
      <div className="flex items-center gap-2">
        <EvidenceBadge grade={grade} />
        <span className="text-sm font-medium">Evidence Grade {grade}</span>
        {data.domain ? (
          <Badge variant="outline" className="text-[10px]">
            {String(data.domain).replace("_", " ")}
          </Badge>
        ) : null}
      </div>

      {/* Title */}
      <div>
        <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Insight
        </h4>
        <p className="text-sm font-semibold">{String(data.title ?? "")}</p>
      </div>

      {/* Full content */}
      <div>
        <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Full Analysis
        </h4>
        <p className="text-sm leading-relaxed">{String(data.content ?? insight?.content ?? "")}</p>
      </div>

      {/* Supporting findings */}
      {insight && insight.supportingFindings.length > 0 ? (
        <div>
          <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Supporting Evidence ({insight.supportingFindings.length} findings)
          </h4>
          <div className="space-y-1">
            {insight.supportingFindings.map((fId) => (
              <button
                key={fId}
                onClick={() => onNavigate(`finding_${fId}`)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
              >
                <FileText className="h-3 w-3 shrink-0 text-emerald-500" />
                <span className="truncate">{fId}</span>
                <ExternalLink className="ml-auto h-3 w-3 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </>
  )
}

// === Helpers ===

function ActivityIcon({ type }: { type: string }) {
  const cls = "h-3 w-3 shrink-0 mt-0.5"
  switch (type) {
    case "agent_thinking":
      return <Brain className={`${cls} text-amber-500`} />
    case "agent_tool_call":
      return <Search className={`${cls} text-blue-500`} />
    case "agent_finding":
      return <FileText className={`${cls} text-emerald-500`} />
    case "agent_complete":
      return <CheckCircle2 className={`${cls} text-emerald-500`} />
    case "agent_error":
      return <AlertCircle className={`${cls} text-destructive`} />
    default:
      return <Bot className={`${cls} text-muted-foreground`} />
  }
}

function activityLabel(ev: AgentEvent): string {
  switch (ev.type) {
    case "agent_thinking":
      return String(ev.data.thought ?? "Thinking...")
    case "agent_tool_call":
      return `Called ${ev.data.toolName}`
    case "agent_finding": {
      const f = ev.data.finding as { title?: string } | undefined
      return `Found: ${f?.title ?? "finding"}`
    }
    case "agent_complete":
      return `Complete — ${ev.data.findingsCount ?? 0} findings`
    case "agent_error":
      return `Error: ${ev.data.error ?? "unknown"}`
    case "agent_spawned":
      return `Spawned`
    default:
      return ev.type
  }
}

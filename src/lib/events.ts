export type AgentEventType =
  | "session_started"
  | "brief_generated"
  | "agent_spawned"
  | "agent_thinking"
  | "agent_tool_call"
  | "agent_finding"
  | "agent_complete"
  | "agent_error"
  | "edge_created"
  | "insight_synthesized"
  | "report_section"
  | "research_complete"
  | "timeout_warning"
  | "error"

export interface AgentEvent {
  type: AgentEventType
  agentId: string
  parentId?: string
  timestamp: number
  data: Record<string, unknown>
}

export function createEvent(
  type: AgentEventType,
  agentId: string,
  data: Record<string, unknown>,
  parentId?: string
): AgentEvent {
  return {
    type,
    agentId,
    parentId,
    timestamp: Date.now(),
    data,
  }
}

export type EmitFn = (event: AgentEvent) => void

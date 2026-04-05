"use client"

import { memo, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useResearchState } from "@/hooks/useResearchState"
import { getAgentConfig } from "./agentConfig"
import { AvatarAura, type AvatarState } from "./AvatarAura"
import { AvatarFace } from "./AvatarFace"
import { AvatarStatusBadge } from "./AvatarStatusBadge"

interface AgentAvatarProps {
  agentId: string
  size?: number
}

function deriveAvatarState(
  nodeStatus: string | undefined,
  recentEventType: string | undefined,
): AvatarState {
  if (!nodeStatus) return "spawned"

  if (nodeStatus === "complete") return "complete"
  if (nodeStatus === "error") return "error"

  // Running state — differentiate by recent activity
  if (nodeStatus === "running") {
    if (recentEventType === "agent_tool_call") return "searching"
    if (recentEventType === "agent_finding") return "found"
    if (recentEventType === "agent_thinking") return "thinking"
    return "thinking"
  }

  return "spawned"
}

export const AgentAvatar = memo(function AgentAvatar({
  agentId,
  size = 96,
}: AgentAvatarProps) {
  const nodeData = useResearchState(
    (s) => s.nodes.find((n) => n.id === agentId)?.data,
  )
  const selectedNodeId = useResearchState((s) => s.selectedNodeId)
  const selectNode = useResearchState((s) => s.selectNode)

  // Get the most recent event for this agent to determine sub-state
  const recentEventType = useResearchState((s) => {
    const events = s.activityLog.filter((e) => e.agentId === agentId)
    return events.length > 0 ? events[events.length - 1].type : undefined
  })

  const config = useMemo(() => getAgentConfig(agentId), [agentId])
  const isSelected = selectedNodeId === agentId

  const avatarState = deriveAvatarState(
    nodeData?.status as string | undefined,
    recentEventType,
  )

  const thought = nodeData?.thought as string | undefined

  return (
    <motion.div
      className="relative flex flex-col items-center gap-2 cursor-pointer"
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => selectNode(isSelected ? null : agentId)}
    >
      {/* Thought bubble */}
      <AnimatePresence mode="wait">
        {thought && avatarState === "thinking" && (
          <motion.div
            key={thought}
            className="absolute -top-14 left-1/2 z-10 max-w-[180px] -translate-x-1/2 rounded-lg border border-border bg-popover/95 px-2.5 py-1.5 shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-[10px] leading-tight text-muted-foreground line-clamp-2">
              {thought}
            </p>
            {/* Tail */}
            <div
              className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-border bg-popover/95"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar SVG */}
      <motion.div
        className="relative"
        animate={
          avatarState === "found"
            ? { y: [0, -6, 0] }
            : avatarState === "error"
              ? { x: [0, -3, 3, -2, 2, 0] }
              : {}
        }
        transition={
          avatarState === "found"
            ? { duration: 0.4, ease: "easeOut" }
            : avatarState === "error"
              ? { duration: 0.4, ease: "easeInOut" }
              : {}
        }
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={`transition-all duration-300 ${
            isSelected
              ? "drop-shadow-[0_0_12px_var(--tw-shadow-color)]"
              : "hover:drop-shadow-[0_0_8px_var(--tw-shadow-color)]"
          }`}
          style={
            {
              "--tw-shadow-color": `${config.teamColor}40`,
              filter: avatarState === "complete" ? "saturate(0.6)" : undefined,
            } as React.CSSProperties
          }
        >
          <AvatarAura state={avatarState} teamColor={config.teamColor} size={size} />
          <AvatarFace state={avatarState} teamColor={config.teamColor} size={size} />
          <AvatarStatusBadge state={avatarState} size={size} />

          {/* Specialty icon */}
          <foreignObject
            x={2}
            y={size - 22}
            width={20}
            height={20}
          >
            <div
              className="flex h-full w-full items-center justify-center rounded-full border shadow-sm"
              style={{
                backgroundColor: `${config.teamColor}15`,
                borderColor: `${config.teamColor}30`,
              }}
            >
              <config.icon className="h-2.5 w-2.5" style={{ color: config.teamColor }} />
            </div>
          </foreignObject>
        </svg>

        {/* Selection ring */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: config.teamColor }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            layoutId="avatar-selection"
          />
        )}
      </motion.div>

      {/* Name label */}
      <div className="text-center">
        <p className="text-[11px] font-medium text-foreground leading-tight">
          {config.displayName}
        </p>
        {nodeData?.role ? (
          <p className="text-[9px] text-muted-foreground leading-tight mt-0.5">
            {avatarState === "searching"
              ? "Searching..."
              : avatarState === "thinking"
                ? "Thinking..."
                : avatarState === "complete"
                  ? "Done"
                  : avatarState === "error"
                    ? "Error"
                    : avatarState === "found"
                      ? "Found something!"
                      : "Starting..."}
          </p>
        ) : null}
      </div>
    </motion.div>
  )
})

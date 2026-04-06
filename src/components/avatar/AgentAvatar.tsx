"use client"

import { memo, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useResearchState } from "@/hooks/useResearchState"
import { getAgentConfig } from "./agentConfig"
import { RiveAvatar } from "./RiveAvatar"
import { AvatarStatusBadge } from "./AvatarStatusBadge"
import type { AvatarState } from "./types"

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

  // Icon badge size — bottom-left corner of avatar
  const iconBadgeSize = 20

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

      {/* Avatar container */}
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
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
        <RiveAvatar state={avatarState} teamColor={config.teamColor} size={size} />

        {/* Status badge — top-right */}
        <AvatarStatusBadge state={avatarState} size={size} />

        {/* Specialty icon — bottom-left */}
        <div
          className="absolute flex items-center justify-center rounded-full border shadow-sm"
          style={{
            width: iconBadgeSize,
            height: iconBadgeSize,
            left: 2,
            bottom: 2,
            backgroundColor: `${config.teamColor}15`,
            borderColor: `${config.teamColor}30`,
          }}
        >
          <config.icon className="h-2.5 w-2.5" style={{ color: config.teamColor }} />
        </div>

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

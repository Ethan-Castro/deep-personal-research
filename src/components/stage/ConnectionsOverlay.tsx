"use client"

import { useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useResearchState } from "@/hooks/useResearchState"
import { getAgentConfig } from "@/components/avatar/agentConfig"

/**
 * Draws animated lines between the supervisor and each spawned agent.
 * Uses the edges data from the store to determine connections.
 * Since we can't easily get DOM positions of avatars without refs,
 * we use a simplified approach: draw abstract connection arcs
 * that represent the delegation flow.
 */
export function ConnectionsOverlay() {
  const edges = useResearchState((s) => s.edges)
  const nodes = useResearchState((s) => s.nodes)

  // Only show edges from supervisor to agent nodes
  const agentEdges = useMemo(() => {
    const agentNodeIds = new Set(
      nodes.filter((n) => n.type === "agent").map((n) => n.id),
    )
    return edges.filter(
      (e) =>
        e.source === "supervisor" &&
        agentNodeIds.has(e.target) &&
        e.target !== "supervisor",
    )
  }, [edges, nodes])

  if (agentEdges.length === 0) return null

  const total = agentEdges.length
  const width = 600
  const height = 200
  const centerX = width / 2
  const startY = 20

  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden opacity-40">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="absolute"
      >
        <AnimatePresence>
          {agentEdges.map((edge, i) => {
            const config = getAgentConfig(edge.target)
            // Spread targets evenly
            const spread = Math.min(400, total * 100)
            const targetX =
              centerX + ((i - (total - 1) / 2) / Math.max(total - 1, 1)) * spread
            const targetY = height - 20

            const controlY = height * 0.5

            const pathD = `M ${centerX} ${startY} Q ${(centerX + targetX) / 2} ${controlY} ${targetX} ${targetY}`

            return (
              <motion.path
                key={edge.id}
                d={pathD}
                fill="none"
                stroke={config.teamColor}
                strokeWidth={1.5}
                strokeDasharray="6 4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              />
            )
          })}
        </AnimatePresence>

        {/* Animated dots traveling along paths */}
        {agentEdges.map((edge, i) => {
          const config = getAgentConfig(edge.target)
          const spread = Math.min(400, total * 100)
          const targetX =
            centerX + ((i - (total - 1) / 2) / Math.max(total - 1, 1)) * spread
          const targetY = height - 20
          const controlY = height * 0.5
          const pathD = `M ${centerX} ${startY} Q ${(centerX + targetX) / 2} ${controlY} ${targetX} ${targetY}`

          return (
            <circle key={`dot-${edge.id}`} r={2.5} fill={config.teamColor}>
              <animateMotion
                dur="2.5s"
                repeatCount="indefinite"
                path={pathD}
                begin={`${i * 0.3}s`}
              />
            </circle>
          )
        })}
      </svg>
    </div>
  )
}

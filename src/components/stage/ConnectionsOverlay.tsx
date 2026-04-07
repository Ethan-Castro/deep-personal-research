"use client"

import { useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useResearchState } from "@/hooks/useResearchState"
import { getAgentConfig } from "@/components/avatar/agentConfig"
import { LottieConnectionEffect } from "./LottieConnectionEffect"

export function ConnectionsOverlay() {
  const edges = useResearchState((s) => s.edges)
  const nodes = useResearchState((s) => s.nodes)

  // Find all orchestrator agents
  const orchestratorIds = useMemo(() => {
    const set = new Set<string>()
    for (const n of nodes) {
      if (n.type === "agent" && n.data?.team === "orchestrator") {
        set.add(n.id)
      }
    }
    return set
  }, [nodes])

  // Show edges from any orchestrator to non-orchestrator agents
  const agentEdges = useMemo(() => {
    const agentNodeIds = new Set(
      nodes.filter((n) => n.type === "agent").map((n) => n.id),
    )
    return edges.filter(
      (e) =>
        orchestratorIds.has(e.source) &&
        agentNodeIds.has(e.target) &&
        !orchestratorIds.has(e.target),
    )
  }, [edges, nodes, orchestratorIds])

  if (agentEdges.length === 0) return null

  const total = agentEdges.length
  const isLabMode = total > 6
  const width = isLabMode ? 1000 : 600
  const height = isLabMode ? 350 : 200
  const maxSpread = isLabMode ? 800 : 400
  const centerX = width / 2
  const startY = 20

  const endpointData = agentEdges.map((edge, i) => {
    const config = getAgentConfig(edge.target)
    const spread = Math.min(maxSpread, total * (isLabMode ? 50 : 100))
    const targetX =
      centerX + ((i - (total - 1) / 2) / Math.max(total - 1, 1)) * spread
    const targetY = height - 20
    return { edge, config, targetX, targetY }
  })

  const containerOffsetX = `calc(50% - ${width / 2}px)`
  const containerOffsetY = `calc(50% - ${height / 2}px)`

  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden opacity-40">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="absolute"
      >
        <AnimatePresence>
          {endpointData.map(({ edge, config, targetX, targetY }, i) => {
            const controlY = height * 0.5
            const pathD = `M ${centerX} ${startY} Q ${(centerX + targetX) / 2} ${controlY} ${targetX} ${targetY}`

            return (
              <motion.path
                key={edge.id}
                d={pathD}
                fill="none"
                stroke={config.teamColor}
                strokeWidth={isLabMode ? 1 : 1.5}
                strokeDasharray="6 4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isLabMode ? 0.4 : 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
              />
            )
          })}
        </AnimatePresence>

        {/* Animated dots traveling along paths */}
        {endpointData.map(({ edge, config, targetX, targetY }, i) => {
          const controlY = height * 0.5
          const pathD = `M ${centerX} ${startY} Q ${(centerX + targetX) / 2} ${controlY} ${targetX} ${targetY}`

          return (
            <circle key={`dot-${edge.id}`} r={isLabMode ? 2 : 2.5} fill={config.teamColor}>
              <animateMotion
                dur="2.5s"
                repeatCount="indefinite"
                path={pathD}
                begin={`${i * 0.2}s`}
              />
            </circle>
          )
        })}
      </svg>

      {/* Lottie pulse effects at connection endpoints */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: containerOffsetX,
          top: containerOffsetY,
          width,
          height,
        }}
      >
        {/* Source pulse at supervisor (top center) */}
        <LottieConnectionEffect
          x={centerX}
          y={startY}
          color="#a855f7"
          isActive={agentEdges.length > 0}
        />
        {/* Target pulses — limit to 10 in LAB mode for performance */}
        {endpointData.slice(0, isLabMode ? 10 : endpointData.length).map(({ edge, config, targetX, targetY }) => (
          <LottieConnectionEffect
            key={`pulse-${edge.id}`}
            x={targetX}
            y={targetY}
            color={config.teamColor}
            isActive
          />
        ))}
      </div>
    </div>
  )
}

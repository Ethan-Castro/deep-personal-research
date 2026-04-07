"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AgentAvatar } from "@/components/avatar/AgentAvatar"
import { SpawnBurst } from "./SpawnBurst"

interface TeamColumnProps {
  label: string
  agentIds: string[]
  color: string
  compact?: boolean
}

export function TeamColumn({ label, agentIds, color, compact }: TeamColumnProps) {
  if (agentIds.length === 0) return null

  const avatarSize = compact ? 72 : 96
  const needsScroll = agentIds.length > 3

  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.span
        className="mb-2 text-[10px] font-semibold uppercase tracking-widest"
        style={{ color }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.7, y: 0 }}
      >
        {label}
        {agentIds.length > 3 && (
          <span className="ml-1 text-[9px] opacity-50">({agentIds.length})</span>
        )}
      </motion.span>

      <div
        className={`flex flex-wrap justify-center ${compact ? "gap-2" : "gap-4"} ${
          needsScroll ? "max-h-[280px] overflow-y-auto overflow-x-hidden pr-1" : ""
        }`}
        style={needsScroll ? { scrollbarWidth: "thin" } : undefined}
      >
        <AnimatePresence>
          {agentIds.map((id) => (
            <motion.div
              key={id}
              className="relative"
              layout
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <SpawnBurst size={avatarSize} />
              <AgentAvatar agentId={id} size={avatarSize} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

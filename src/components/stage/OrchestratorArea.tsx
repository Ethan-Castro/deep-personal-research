"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AgentAvatar } from "@/components/avatar/AgentAvatar"
import { SpawnBurst } from "./SpawnBurst"

interface OrchestratorAreaProps {
  agentId?: string | null
  agentIds?: string[]
}

export function OrchestratorArea({ agentId, agentIds }: OrchestratorAreaProps) {
  const ids = agentIds ?? (agentId ? [agentId] : [])
  const isMulti = ids.length > 1
  const avatarSize = isMulti ? 96 : 112

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.span
        className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-purple-500/70"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.7, y: 0 }}
      >
        Orchestrator
      </motion.span>

      <div className="flex items-center gap-3">
        <AnimatePresence>
          {ids.map((id) => (
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
    </div>
  )
}

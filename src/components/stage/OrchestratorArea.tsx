"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AgentAvatar } from "@/components/avatar/AgentAvatar"

interface OrchestratorAreaProps {
  agentId: string | null
}

export function OrchestratorArea({ agentId }: OrchestratorAreaProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.span
        className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-purple-500/70"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.7, y: 0 }}
      >
        Orchestrator
      </motion.span>

      <AnimatePresence>
        {agentId && (
          <motion.div
            key={agentId}
            layout
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <AgentAvatar agentId={agentId} size={112} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

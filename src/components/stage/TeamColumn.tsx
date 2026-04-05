"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AgentAvatar } from "@/components/avatar/AgentAvatar"

interface TeamColumnProps {
  label: string
  agentIds: string[]
  color: string
}

export function TeamColumn({ label, agentIds, color }: TeamColumnProps) {
  if (agentIds.length === 0) return null

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
      </motion.span>

      <div className="flex flex-wrap justify-center gap-4">
        <AnimatePresence>
          {agentIds.map((id) => (
            <motion.div
              key={id}
              layout
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <AgentAvatar agentId={id} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

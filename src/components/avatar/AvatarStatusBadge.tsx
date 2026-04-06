"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Loader2 } from "lucide-react"
import type { AvatarState } from "./types"

interface AvatarStatusBadgeProps {
  state: AvatarState
  size?: number
}

export function AvatarStatusBadge({ state, size = 96 }: AvatarStatusBadgeProps) {
  const badgeSize = 22
  // Position badge at top-right of the avatar container
  const right = -badgeSize / 2 + 2
  const top = -badgeSize / 2 + 6

  const isActive = state === "thinking" || state === "searching" || state === "found" || state === "spawned"
  const isComplete = state === "complete"
  const isError = state === "error"

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key="active"
          className="absolute flex items-center justify-center rounded-full bg-background border border-border shadow-sm"
          style={{ width: badgeSize, height: badgeSize, right, top }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
        >
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        </motion.div>
      )}
      {isComplete && (
        <motion.div
          key="complete"
          className="absolute flex items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 shadow-sm"
          style={{ width: badgeSize, height: badgeSize, right, top }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <Check className="h-3 w-3 text-emerald-500" />
        </motion.div>
      )}
      {isError && (
        <motion.div
          key="error"
          className="absolute flex items-center justify-center rounded-full bg-red-500/20 border border-red-500/40 shadow-sm"
          style={{ width: badgeSize, height: badgeSize, right, top }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
        >
          <X className="h-3 w-3 text-red-500" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

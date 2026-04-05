"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Loader2 } from "lucide-react"
import type { AvatarState } from "./AvatarAura"

interface AvatarStatusBadgeProps {
  state: AvatarState
  size?: number
}

export function AvatarStatusBadge({ state, size = 96 }: AvatarStatusBadgeProps) {
  const badgeSize = 22
  const x = size - badgeSize / 2 - 2
  const y = -badgeSize / 2 + 6

  const isActive = state === "thinking" || state === "searching" || state === "found" || state === "spawned"
  const isComplete = state === "complete"
  const isError = state === "error"

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.foreignObject
          key="active"
          x={x}
          y={y}
          width={badgeSize}
          height={badgeSize}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-background border border-border shadow-sm">
            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
          </div>
        </motion.foreignObject>
      )}
      {isComplete && (
        <motion.foreignObject
          key="complete"
          x={x}
          y={y}
          width={badgeSize}
          height={badgeSize}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 shadow-sm">
            <Check className="h-3 w-3 text-emerald-500" />
          </div>
        </motion.foreignObject>
      )}
      {isError && (
        <motion.foreignObject
          key="error"
          x={x}
          y={y}
          width={badgeSize}
          height={badgeSize}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-red-500/20 border border-red-500/40 shadow-sm">
            <X className="h-3 w-3 text-red-500" />
          </div>
        </motion.foreignObject>
      )}
    </AnimatePresence>
  )
}

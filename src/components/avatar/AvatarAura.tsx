"use client"

import { motion, type Variants } from "framer-motion"

export type AvatarState =
  | "spawned"
  | "thinking"
  | "searching"
  | "found"
  | "complete"
  | "error"

interface AvatarAuraProps {
  state: AvatarState
  teamColor: string
  size?: number
}

const auraVariants: Variants = {
  spawned: {
    scale: [1, 1.4, 1],
    opacity: [0.6, 0.2, 0.4],
    transition: { duration: 0.8, ease: "easeOut" },
  },
  thinking: {
    scale: [0.95, 1.08, 0.95],
    opacity: [0.25, 0.55, 0.25],
    transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
  },
  searching: {
    scale: [0.98, 1.12, 0.98],
    opacity: [0.4, 0.8, 0.4],
    transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
  },
  found: {
    scale: [1, 1.35, 1.05],
    opacity: [0.5, 0.9, 0.35],
    transition: { duration: 0.6, ease: "easeOut" },
  },
  complete: {
    scale: 1,
    opacity: 0.15,
    transition: { duration: 0.8, ease: "easeOut" },
  },
  error: {
    scale: 1,
    opacity: [0.3, 0.8, 0.3, 0.8, 0.3, 0.2],
    transition: { duration: 0.8, ease: "easeInOut" },
  },
}

export function AvatarAura({ state, teamColor, size = 96 }: AvatarAuraProps) {
  const r = size / 2
  const errorColor = "#ef4444"
  const fillColor = state === "error" ? errorColor : teamColor

  return (
    <motion.circle
      cx={r}
      cy={r}
      r={r - 2}
      fill="none"
      stroke={fillColor}
      strokeWidth={2.5}
      filter={`drop-shadow(0 0 ${state === "searching" ? 8 : 4}px ${fillColor}40)`}
      variants={auraVariants}
      animate={state}
    />
  )
}

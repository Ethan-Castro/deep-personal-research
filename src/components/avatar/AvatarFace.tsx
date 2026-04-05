"use client"

import { useEffect, useRef, useCallback } from "react"
import { motion, useAnimation, type Variants } from "framer-motion"
import type { AvatarState } from "./AvatarAura"

interface AvatarFaceProps {
  state: AvatarState
  teamColor: string
  size?: number
}

// Eye variants
const leftEyeVariants: Variants = {
  open: { scaleY: 1, x: 0 },
  blink: {
    scaleY: [1, 0.1, 1],
    transition: { duration: 0.18, times: [0, 0.5, 1] },
  },
  thinking: {
    x: [0, 2.5, 0, -2.5, 0],
    scaleY: 1,
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
  searching: {
    scaleY: 0.55,
    x: 0,
    transition: { duration: 0.3 },
  },
  wide: {
    scaleY: 1.3,
    scaleX: 1.2,
    x: 0,
    transition: { type: "spring", stiffness: 400, damping: 15 },
  },
  closed: {
    scaleY: 0.1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  error: {
    scaleY: 0,
    x: 0,
    transition: { duration: 0.1 },
  },
}

const rightEyeVariants: Variants = {
  ...leftEyeVariants,
  thinking: {
    x: [0, 2.5, 0, -2.5, 0],
    scaleY: 1,
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.1 },
  },
}

// Mouth path data for each expression
const MOUTH_PATHS = {
  neutral: "M -6 0 Q 0 0 6 0",
  thinking: "M -6 0 Q -3 2 0 0 Q 3 -2 6 0",
  searching: "M -4 -2 Q 0 -4 4 -2 Q 4 2 0 4 Q -4 2 -4 -2 Z",
  smile: "M -6 -1 Q 0 5 6 -1",
  frown: "M -6 2 Q 0 -3 6 2",
}

function stateToMouth(state: AvatarState): string {
  switch (state) {
    case "thinking":
      return MOUTH_PATHS.thinking
    case "searching":
      return MOUTH_PATHS.searching
    case "found":
    case "complete":
      return MOUTH_PATHS.smile
    case "error":
      return MOUTH_PATHS.frown
    default:
      return MOUTH_PATHS.neutral
  }
}

function stateToEyeVariant(state: AvatarState): string {
  switch (state) {
    case "thinking":
      return "thinking"
    case "searching":
      return "searching"
    case "found":
      return "wide"
    case "complete":
      return "closed"
    case "error":
      return "error"
    default:
      return "open"
  }
}

export function AvatarFace({ state, teamColor, size = 96 }: AvatarFaceProps) {
  const cx = size / 2
  const cy = size / 2
  const faceR = size / 2 - 8
  const eyeRx = size * 0.055
  const eyeRy = size * 0.07
  const eyeSpacing = size * 0.14
  const eyeY = cy - size * 0.06
  const mouthY = cy + size * 0.12

  const leftEyeControls = useAnimation()
  const rightEyeControls = useAnimation()
  const blinkTimeout = useRef<ReturnType<typeof setTimeout>>(null)

  const scheduleBlink = useCallback(() => {
    const delay = 2500 + Math.random() * 3000
    blinkTimeout.current = setTimeout(async () => {
      if (state === "spawned" || state === "thinking" || state === "found") {
        await leftEyeControls.start("blink")
        rightEyeControls.start("blink")
      }
      scheduleBlink()
    }, delay)
  }, [state, leftEyeControls, rightEyeControls])

  useEffect(() => {
    const variant = stateToEyeVariant(state)
    leftEyeControls.start(variant)
    rightEyeControls.start(variant)
    scheduleBlink()
    return () => { if (blinkTimeout.current) clearTimeout(blinkTimeout.current) }
  }, [state, leftEyeControls, rightEyeControls, scheduleBlink])

  const eyeVariant = stateToEyeVariant(state)

  return (
    <g>
      {/* Face plate */}
      <circle
        cx={cx}
        cy={cy}
        r={faceR}
        fill={`${teamColor}15`}
        stroke={`${teamColor}30`}
        strokeWidth={1}
      />

      {/* Inner face gradient */}
      <defs>
        <radialGradient id={`face-grad-${teamColor}`} cx="40%" cy="35%">
          <stop offset="0%" stopColor={`${teamColor}20`} />
          <stop offset="100%" stopColor={`${teamColor}08`} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={faceR - 2} fill={`url(#face-grad-${teamColor})`} />

      {/* Eyes */}
      {state === "error" ? (
        <>
          {/* X eyes for error */}
          <g transform={`translate(${cx - eyeSpacing}, ${eyeY})`} stroke={`${teamColor}cc`} strokeWidth={1.8} strokeLinecap="round">
            <line x1={-eyeRx} y1={-eyeRy} x2={eyeRx} y2={eyeRy} />
            <line x1={eyeRx} y1={-eyeRy} x2={-eyeRx} y2={eyeRy} />
          </g>
          <g transform={`translate(${cx + eyeSpacing}, ${eyeY})`} stroke={`${teamColor}cc`} strokeWidth={1.8} strokeLinecap="round">
            <line x1={-eyeRx} y1={-eyeRy} x2={eyeRx} y2={eyeRy} />
            <line x1={eyeRx} y1={-eyeRy} x2={-eyeRx} y2={eyeRy} />
          </g>
        </>
      ) : (
        <>
          <motion.ellipse
            cx={cx - eyeSpacing}
            cy={eyeY}
            rx={eyeRx}
            ry={eyeRy}
            fill={`${teamColor}cc`}
            variants={leftEyeVariants}
            animate={leftEyeControls}
            initial={eyeVariant}
          />
          <motion.ellipse
            cx={cx + eyeSpacing}
            cy={eyeY}
            rx={eyeRx}
            ry={eyeRy}
            fill={`${teamColor}cc`}
            variants={rightEyeVariants}
            animate={rightEyeControls}
            initial={eyeVariant}
          />
        </>
      )}

      {/* Mouth */}
      <motion.path
        d={stateToMouth(state)}
        transform={`translate(${cx}, ${mouthY})`}
        fill={state === "searching" ? `${teamColor}40` : "none"}
        stroke={`${teamColor}90`}
        strokeWidth={1.5}
        strokeLinecap="round"
        animate={{ d: stateToMouth(state) }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    </g>
  )
}

"use client"

import Lottie from "lottie-react"
import connectionPulse from "../../../public/lottie/connection-pulse.json"

interface LottieConnectionEffectProps {
  x: number
  y: number
  color: string
  isActive: boolean
}

export function LottieConnectionEffect({ x, y, isActive }: LottieConnectionEffectProps) {
  if (!isActive) return null

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: x - 10,
        top: y - 10,
        width: 20,
        height: 20,
      }}
    >
      <Lottie
        animationData={connectionPulse}
        loop
        autoplay
        style={{ width: 20, height: 20 }}
      />
    </div>
  )
}
